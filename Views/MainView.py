# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'MainViewWvODPc.ui'
##
## Created by: Qt User Interface Compiler version 5.15.2
##
## WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PySide2.QtCore import *
from PySide2.QtGui import *
from PySide2.QtWidgets import *


class Ui_MainView(object):
    def setupUi(self, MainView):
        if not MainView.objectName():
            MainView.setObjectName(u"MainView")
        MainView.resize(900, 600)
        MainView.setMinimumSize(QSize(900, 600))
        MainView.setMaximumSize(QSize(900, 600))
        self.centralwidget = QWidget(MainView)
        self.centralwidget.setObjectName(u"centralwidget")
        self.centralwidget.setMinimumSize(QSize(900, 600))
        self.centralwidget.setMaximumSize(QSize(900, 600))
        self.frame = QFrame(self.centralwidget)
        self.frame.setObjectName(u"frame")
        self.frame.setGeometry(QRect(0, 0, 900, 600))
        self.frame.setFrameShape(QFrame.StyledPanel)
        self.frame.setFrameShadow(QFrame.Raised)
        self.gridLayoutWidget = QWidget(self.frame)
        self.gridLayoutWidget.setObjectName(u"gridLayoutWidget")
        self.gridLayoutWidget.setGeometry(QRect(0, 0, 901, 601))
        self.mainFrameLayout = QGridLayout(self.gridLayoutWidget)
        self.mainFrameLayout.setSpacing(0)
        self.mainFrameLayout.setObjectName(u"mainFrameLayout")
        self.mainFrameLayout.setContentsMargins(0, 0, 0, 0)
        self.mainFrame = QLabel(self.gridLayoutWidget)
        self.mainFrame.setObjectName(u"mainFrame")
        self.mainFrame.setPixmap(QPixmap(u"Resources/camera-lens.png"))
        self.mainFrame.setAlignment(Qt.AlignCenter)

        self.mainFrameLayout.addWidget(self.mainFrame, 0, 0, 1, 1)

        self.sidebarFrame = QFrame(self.centralwidget)
        self.sidebarFrame.setObjectName(u"sidebarFrame")
        self.sidebarFrame.setGeometry(QRect(-160, 0, 160, 600))
        self.sidebarFrame.setFrameShape(QFrame.StyledPanel)
        self.sidebarFrame.setFrameShadow(QFrame.Raised)
        self.popupSidebarBtn = QPushButton(self.sidebarFrame)
        self.popupSidebarBtn.setObjectName(u"popupSidebarBtn")
        self.popupSidebarBtn.setGeometry(QRect(124, 4, 32, 32))
        self.popupSidebarBtn.setStyleSheet(u"background-color: rgb(170, 255, 255);")
        icon = QIcon()
        icon.addFile(u"Resources/menu.png", QSize(), QIcon.Normal, QIcon.Off)
        self.popupSidebarBtn.setIcon(icon)
        self.popupSidebarBtn.setIconSize(QSize(20, 20))
        self.sidebarContainer = QFrame(self.sidebarFrame)
        self.sidebarContainer.setObjectName(u"sidebarContainer")
        self.sidebarContainer.setGeometry(QRect(0, 0, 120, 600))
        self.sidebarContainer.setStyleSheet(u"background-color: rgba(116, 185, 255, 150);")
        self.sidebarContainer.setFrameShape(QFrame.StyledPanel)
        self.sidebarContainer.setFrameShadow(QFrame.Raised)
        self.verticalLayoutWidget = QWidget(self.sidebarContainer)
        self.verticalLayoutWidget.setObjectName(u"verticalLayoutWidget")
        self.verticalLayoutWidget.setGeometry(QRect(0, 0, 121, 571))
        self.sidebarLayout = QVBoxLayout(self.verticalLayoutWidget)
        self.sidebarLayout.setSpacing(12)
        self.sidebarLayout.setObjectName(u"sidebarLayout")
        self.sidebarLayout.setContentsMargins(12, 12, 12, 12)
        self.sidebarScanBtn = QPushButton(self.verticalLayoutWidget)
        self.sidebarScanBtn.setObjectName(u"sidebarScanBtn")
        self.sidebarScanBtn.setStyleSheet(u"background-color: rgb(116, 185, 255);\n"
"QPushButton{\n"
"	border-style: solid;\n"
"	border-color: black;\n"
"	border-width: 0px;\n"
"	border-radius: 12px;\n"
"}")
        icon1 = QIcon()
        icon1.addFile(u"Resources/scan.png", QSize(), QIcon.Normal, QIcon.Off)
        self.sidebarScanBtn.setIcon(icon1)
        self.sidebarScanBtn.setIconSize(QSize(20, 20))

        self.sidebarLayout.addWidget(self.sidebarScanBtn)

        self.sidebarAdminBtn = QPushButton(self.verticalLayoutWidget)
        self.sidebarAdminBtn.setObjectName(u"sidebarAdminBtn")
        icon2 = QIcon()
        icon2.addFile(u"Resources/admin.png", QSize(), QIcon.Normal, QIcon.Off)
        self.sidebarAdminBtn.setIcon(icon2)
        self.sidebarAdminBtn.setIconSize(QSize(20, 20))

        self.sidebarLayout.addWidget(self.sidebarAdminBtn)

        self.spacer = QLabel(self.verticalLayoutWidget)
        self.spacer.setObjectName(u"spacer")
        self.spacer.setStyleSheet(u"background-color: rgba(255, 255, 255, 0);")

        self.sidebarLayout.addWidget(self.spacer)

        MainView.setCentralWidget(self.centralwidget)

        self.retranslateUi(MainView)

        QMetaObject.connectSlotsByName(MainView)
    # setupUi

    def retranslateUi(self, MainView):
        MainView.setWindowTitle(QCoreApplication.translate("MainView", u"MainWindow", None))
        self.mainFrame.setText("")
        self.popupSidebarBtn.setText("")
        self.sidebarScanBtn.setText(QCoreApplication.translate("MainView", u" Scan", None))
        self.sidebarAdminBtn.setText(QCoreApplication.translate("MainView", u"Admin", None))
        self.spacer.setText("")
    # retranslateUi

