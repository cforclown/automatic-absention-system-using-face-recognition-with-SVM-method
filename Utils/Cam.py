import cv2


def getAllCamDevicePorts():
    nonWorkingPorts = []
    devPort = 0
    workingPorts = []
    availablePorts = []
    while len(nonWorkingPorts) < 6: # if there are more than 5 non working ports stop the testing. 
        camera = cv2.VideoCapture(devPort)
        if not camera.isOpened():
            nonWorkingPorts.append(devPort)
            # print("Port %s is not working." %devPort)
        else:
            isReading, img = camera.read()
            w = camera.get(3)
            h = camera.get(4)
            if isReading:
                # print("Port %s is working and reads images (%s x %s)" %(devPort,h,w))
                workingPorts.append(devPort)
            else:
                # print("Port %s for camera ( %s x %s) is present but does not reads." %(devPort,h,w))
                availablePorts.append(devPort)
        devPort +=1
    return availablePorts, workingPorts, nonWorkingPorts

def getCamCapture(port, res=None):
    cap=cv2.VideoCapture(port, cv2.CAP_DSHOW)
    if res is not None:
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, res[0])
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, res[1])
    return cap
