@Library("ir-jenkins-build-library@R1.0.8")
import static ir.build.Utilities.*
import static ir.build.Stages.*
import ir.build.Node
import ir.build.AristotleRegions
import ir.build.AristotleStages

def err
def mail_list = 'development-electron@ir.com'

stage('Load parameters and Approval') {
  properties([
    parameters([
      booleanParam(name: 'AWSCleanup', description: 'Undeployment flag', defaultValue: false),
      string(name: 'ReleaseTag', description: 'Git tag to build from', defaultValue: '')
    ])
  ])
  /**
  * IMPORTANT: this line should be
  *    * OUTSIDE OF ANY NODE() BLOCK!!!
  *    * before any actual write/update work
  *    * should be in a stage block
  *    * good to be after all parameter definitions
  * Optional: FolderProperties.BRANCH_NAME:  used in case the pipeline isn't a multibranch one
  * Optional: FolderProperties.JK_INPUT_APPROVERS:  User IDs and/or external
  *             group names of person or people permitted to respond to the
  *             input, separated by ','. Spaces will be trimmed. This means that "alice, bob, blah "
  *             will be equivalent to "alice,bob,blah"
  * @param jenkinsNodeName required, The Jenkin node to use to do part of the job
  */
  adminApproveUatProdDeployment(this, env.BRANCH_NAME, "docker");
}

node('docker') {
  def image = docker.image(getDockerImage('saas/deploy:node_latest'))
  image.pull()
  image.inside {
    try {
      branch = env.BRANCH_NAME == 'master' ? 'dev' : env.BRANCH_NAME
      deploy_environment = AristotleStages.getEnvironment(branch)
      println "[-]Aristotle stage environment :: ${deploy_environment}"
      stage_branch = deploy_environment.stageBranch
      core_aws_alias = deploy_environment.central_alias
      shared_aws_alias = deploy_environment.tenant_aliases[0]
      ir_account_id = getAwsAccountNo(core_aws_alias)
      shared_account_id = getAwsAccountNo(shared_aws_alias)
      primary_region = AristotleRegions.PRIMARY_REGION
      service_name = 'component-uc-sbc-collection'
      stack_name = "${service_name}-${branch}"
      component_name = 'component_collection_sbc'

      def scmVars
      if (params.ReleaseTag) {
        scmVars = scmByTagWithCredentials(this, 'ir-aristotle/component-uc-sbc-collection', params.ReleaseTag, 'gitbuild-onprem-token')
      } else {
        scmVars = checkout scm
      }
      println "[scmVars] ${scmVars}"

      slsCommand = params.AWSCleanup ? 'remove' : 'deploy'

      if (!params.AWSCleanup) {
        stage('install') {
          sh """
            echo "[STAGE install dependencies]"
            unset NODE_ENV
            npm ci
          """
        }

        stage ('Run Lint, Unit Tests, Code Coverage, Build, Audit and License Checker') {
          Node.npmBuild(this)

          if (currentBuild.result == "UNSTABLE") {
            throw new Exception("Current build is unstable due to a code or test regression. Refer to the console log for more details.")
          }
        }
      }

      stage("${slsCommand}") {
        withAWS(role:'DeployRole', roleAccount:getAwsAccountNo(core_aws_alias)) {
          sh """
            echo "[STAGE ${slsCommand}]"
            export ACCOUNT_ALIAS=${core_aws_alias}
            export IR_ACCOUNT_ID="${ir_account_id}"
            export SHARED_ACCOUNT_ID="${shared_account_id}"
            export PRIMARY_REGION=${primary_region}
            export BRANCH=${branch}
            export STAGE_BRANCH=${stage_branch}
            export SERVICE_NAME=${service_name}
            export STACK_NAME=${stack_name}
            export COMPONENT_NAME=${component_name}
            sls ${slsCommand}
          """
        }
      }

      if (!params.AWSCleanup && deploy_environment.isStageBranch) {
        stage('register') {
          withAWS(role:'DeployRole', roleAccount:getAwsAccountNo(core_aws_alias)) {
            sh """
              echo "[STAGE register]"
              npm run register -- \
                --name ${component_name} \
                --stackName ${stack_name} \
                --region ${primary_region} \
                --stage ${stage_branch} \
                --apiDomain ${deploy_environment.apiDomain}
            """
          }
        }
      }
    } catch (caughtError) {
      err = caughtError
      currentBuild.result = "Failure"

      stage('Send Notification') {
        msTeams(this, teams_url, "${env.JOB_NAME} - ${env.BRANCH_NAME}: Build Failed ❗", env.BUILD_URL, "FAILURE")
        if(stage == 'master') {
          email(this, "Failed: aristotle-subscription: ${branch}", "Error:\n\n" + err.getMessage(), mail_list)
        }
      }
    } finally {
      step([$class: 'WsCleanup'])
      if (err) {
        throw err
      }
    }
  }
}
