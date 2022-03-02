import os
import traceback
from datetime import datetime
from PySide2.QtCore import Qt, QThread, Signal
from PySide2.QtGui import QImage
import cv2
import numpy as np
from Utils.Cam import getCamCapture
from Utils.SettingsManager import Settings


class ROI:
    def __init__(self, x, y, w, h):
        self.x=x
        self.y=y
        self.w=w
        self.h=h

class CamThread(QThread):
    isActive=False
    isPause=True
    isHalt=False

    frameUpdateSignal=Signal(QImage)

    cameraPort=Settings().getCameraPort()
    cameraRes=Settings().getCameraResolution()
    detectionParams=Settings().getDetectionParams()
    frameSize=None
    roiSize=None

    trainedFacesPath='/Faces/Trained/trainer.xml'
    faceDetector=cv2.CascadeClassifier('/Detector/haarcascade_frontalface_default.xml')
    faceRecognizer = cv2.face.LBPHFaceRecognizer_create()
    faceRecognizer.read(trainedFacesPath)
    font = cv2.FONT_HERSHEY_SIMPLEX

    def run(self):
        capture = getCamCapture(self.cameraPort, self.cameraRes)
        if capture.isOpened(): 
            self.frameSize  = [capture.get(cv2.CAP_PROP_FRAME_WIDTH), capture.get(cv2.CAP_PROP_FRAME_HEIGHT)]
            self.roiSize=ROI(int(self.frameSize[0]/4), int(self.frameSize[1]/4), int(self.frameSize[0]/2), int(self.frameSize[1]/2))
        else:
            print('[ERROR] FAILED TO ACCESS CAMERA!')
            return

        self.isActive=True
        self.isPause=False
        self.isHalt=False

        while self.isActive:
            if self.isPause or self.isHalt:
                continue
            try:
                ret, rawFrame = capture.read()
                if ret:
                    roiFrame = self.detect(rawFrame)
                    cv2.rectangle(
                        rawFrame, 
                        (self.roiSize.x, self.roiSize.y), 
                        (self.roiSize.x+self.roiSize.w, self.roiSize.y+self.roiSize.h), 
                        (75, 75, 255), 
                        2
                    )

                    frame = cv2.flip(cv2.cvtColor(rawFrame, cv2.COLOR_BGR2RGB), 1)
                    frameQtFormat = QImage(frame.data, frame.shape[1], frame.shape[0], QImage.Format_RGB888)

                    self.frameUpdateSignal.emit(frameQtFormat.scaled(self.cameraRes[0], self.cameraRes[1], Qt.KeepAspectRatio))
            except Exception as e:
                print(traceback.format_exc())
        capture.release()
        capture=None
        print('[THREAD] Camera worker stopped')

    def pause(self):
        self.isPause = True

    def resume(self):
        self.isPause = False

    def halt(self):
        self.isHalt = True

    def endHalt(self):
        self.isHalt = False

    def stop(self):
        self.isActive = False

    def detect(self, frame, minWidth, minHeight):
        roiFrame=frame[
            self.roiSize.y:self.roiSize.y + self.roiSize.h, 
            self.roiSize.x:self.roiSize.x + self.roiSize.w
        ]

        gray = cv2.cvtColor(roiFrame, cv2.COLOR_BGR2GRAY)
        faces = self.faceDetector.detectMultiScale(gray, 1.2, 5, minSize=(round(minWidth), round(minHeight)))
        user, confidence = None, None
        for (x, y, w, h) in faces:
            frame = cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0),2)
            user, confidence = self.recognize(gray[y:y+h,x:x+w])

        return roiFrame

    def recognize(self, detectedFaceGray):
        user=None
        id, confidence = self.faceRecognizer.predict(detectedFaceGray)
        if confidence > 70:
            return None, None
        
        user=self.database.findOne(id)
        if user is not None:
            confidence=round(150 - confidence)
        return user, confidence
    