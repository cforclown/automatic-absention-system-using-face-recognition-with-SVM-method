import traceback
import json
from numpy import number
from Utils.Cam import getAllCamDevicePorts
from Utils.SingletonMeta import SingletonMeta

class ISettings:
  def __init__(self, settingsData):
    if Settings.CAMERA_PORT_KEY in settingsData:
      self.camera=settingsData[Settings.CAMERA_PORT_KEY]
    else:
      self.camera=0
    
    if Settings.CAMERA_RES_KEY in settingsData:
      self.cameraRes=settingsData[Settings.CAMERA_RES_KEY]
    else:
      self.cameraRes=CameraResolutions.RES_720P
    
    if Settings.DETECTION_PARAMS_KEY in settingsData:
      self.detectionParams=settingsData[Settings.DETECTION_PARAMS_KEY]
    else:
      self.detectionParams=[
        {
          Settings.LOW_HSV_KEY: [0, 0, 0],
          Settings.HIGH_HSV_KEY: [30, 255, 255],
          Settings.BLUR_TYPE_KEY: 0,
          Settings.MEDIAN_BLUR_SCALE_KEY: 25,
          Settings.GAUSSIAN_BLUR_SCALE_KEY: 25
        },
        {
          Settings.LOW_HSV_KEY: [150, 0, 0],
          Settings.HIGH_HSV_KEY: [179, 255, 255],
          Settings.BLUR_TYPE_KEY: 0,
          Settings.MEDIAN_BLUR_SCALE_KEY: 25,
          Settings.GAUSSIAN_BLUR_SCALE_KEY: 25
        }
      ]
    
    self.json={
      Settings.CAMERA_PORT_KEY: self.camera,
      Settings.CAMERA_RES_KEY: self.cameraRes,
      Settings.DETECTION_PARAMS_KEY: self.detectionParams,
    }

  def toJSON(self):
    return {
      Settings.CAMERA_PORT_KEY: self.camera,
      Settings.CAMERA_RES_KEY: self.cameraRes,
      Settings.DETECTION_PARAMS_KEY: self.detectionParams,
    }

class CameraResolutions:
  RES_360P=[640, 360]
  RES_480P=[640, 480]
  RES_720P=[1280, 720]
  RES_1080P=[1920, 1080]
  VALUES={
    'RES_360P': RES_360P,
    'RES_480P': RES_480P,
    'RES_720P': RES_720P,
    'RES_1080P': RES_1080P,
  }


class Settings(metaclass=SingletonMeta):
  SETTINGS_PATH='./Data/data.json'
  SETTINGS_FIELD='settings'
  CAMERA_PORT_KEY='camera'
  CAMERA_RES_KEY='cameraResolution'
  DETECTION_PARAMS_KEY='detectionParams'
  LOW_RED_KEY=0
  HIGH_RED_KEY=1
  LOW_HSV_KEY='lowHSV'
  HIGH_HSV_KEY='highHSV'
  BLUR_TYPE_KEY='blurType'
  MEDIAN_BLUR_SCALE_KEY='medianBlurScale'
  GAUSSIAN_BLUR_SCALE_KEY='gaussianBlurScale'

  BLUR_TYPE_MEDIAN_BLUR=0
  BLUR_TYPE_GAUSSIAN_BLUR=1

  def getJSON(self):
    return self.get().json

  def get(self):
    with open(self.SETTINGS_PATH, 'r') as dataFile:
      settingsJSON=json.load(dataFile)
      if self.SETTINGS_FIELD not in settingsJSON:
        settingsJSON={}
      else:
        settingsJSON=settingsJSON[self.SETTINGS_FIELD]
    return ISettings(settingsJSON)

  def getCameraPort(self) -> number:
    settings=self.get()
    availablePorts, workingPorts, nonWorkingPorts=getAllCamDevicePorts()
    if len(workingPorts) > 0:
      if settings.camera in workingPorts:
        return settings.camera
      else:
        self.updateCameraPort(workingPorts[0])
        return workingPorts[0]
    else:
      return availablePorts[0]

  def updateCameraPort(self, cameraIndex):
    return self.set(self.CAMERA_PORT_KEY, cameraIndex)

  def getCameraResolution(self):
    return self.get().cameraRes

  def updateCameraResolution(self, cameraRes):
    if cameraRes is not CameraResolutions.RES_360P and cameraRes is not CameraResolutions.RES_480P  and cameraRes is not CameraResolutions.RES_720P  and cameraRes is not CameraResolutions.RES_1080P:
      raise Exception('INVALID CAMERA RESOLUTION')
    return self.set(self.CAMERA_RES_KEY, cameraRes)

  def getDetectionParams(self):
    return self.get().detectionParams

  def updateDetectionParams(self, lowHSV, highHSV, blurType, medianBlurScale, gaussianBlurScale, isLowRed):
    settings=self.getJSON()
    settings[self.DETECTION_PARAMS_KEY][0 if isLowRed else 1]={
      self.LOW_HSV_KEY: lowHSV,
      self.HIGH_HSV_KEY: highHSV,
      self.BLUR_TYPE_KEY: blurType,
      self.MEDIAN_BLUR_SCALE_KEY: medianBlurScale if medianBlurScale%2>0 else medianBlurScale+1,
      self.GAUSSIAN_BLUR_SCALE_KEY: gaussianBlurScale if gaussianBlurScale%2>0 else gaussianBlurScale+1,
    }
    return self.set(self.DETECTION_PARAMS_KEY, settings[self.DETECTION_PARAMS_KEY])
  
  def save(self, settingJson):
    try:
      with open(self.SETTINGS_PATH, 'w') as dataFile:
        json.dump({
          self.SETTINGS_FIELD: settingJson
        }, dataFile, indent=2)
    except Exception as e:
        print('[ERROR] [SETTINGS] [SET]', traceback.format_exc())
    finally:
      return self.get()

  def set(self, prefix, value):
    settings=self.getJSON()
    settings[prefix]=value
    try:
      with open(self.SETTINGS_PATH, 'w') as dataFile:
        json.dump({
          self.SETTINGS_FIELD: settings
        }, dataFile, indent=2)
    except Exception as e:
        print('[ERROR] [SETTINGS] [SET]', traceback.format_exc())
    finally:
      return self.get()
