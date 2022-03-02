from time import sleep
from PySide2.QtWidgets import QMainWindow
from PySide2.QtGui import QPixmap, QCloseEvent, QShowEvent
from PySide2.QtCore import QEvent
from Utils.CamThread import CamThread
from Views.MainView import Ui_MainView


class View(QMainWindow):
  DEFAULT_MODE='Default'
  VERBOSE_MODE='Verbose'

  def __init__(self):
    super().__init__()
    
    self.lastWindowEvent=None
    self.ui = Ui_MainView()
    self.ui.setupUi(self)
    self.installEventFilter(self)
    self.setAcceptDrops(True)
    
    self.initializeStartup()
    self.show()

  def initializeStartup(self):
    self.initCam()
  
  def initCam(self):
    self.camThread=CamThread()
    self.camThread.frameUpdateSignal.connect(self.imageUpdateCallback)

  def startCam(self):
    if self.camThread is None:
      return
    self.camThread.start()
  
  def stopCam(self):
    if self.camThread is None:
      return
    self.camThread.frameUpdateSignal.disconnect()
    self.camThread.stop()
    self.camThread.quit()
    self.camThread.wait()
    while self.camThread.isRunning():
      sleep(0.1)
    self.camThread=None

  # ====================================================================== EVENT ======================================================================
  def showEvent(self, event: QShowEvent):
    self.startCam()

  def closeEvent(self, event: QCloseEvent):
    self.stopCam()

  def eventFilter(self, object, event):
    pass
  # ===================================================================================================================================================

  # =============================================================== CAM WORKER EVENTs ==============================================================
  def imageUpdateCallback(self, frame):
    self.ui.mainFrame.setPixmap(QPixmap.fromImage(frame))
  # ===================================================================================================================================================
