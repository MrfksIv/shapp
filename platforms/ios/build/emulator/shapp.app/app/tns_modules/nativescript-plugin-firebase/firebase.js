"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase_common_1 = require("./firebase-common");
var application = require("tns-core-modules/application");
var applicationSettings = require("tns-core-modules/application-settings");
var utils = require("tns-core-modules/utils/utils");
var types = require("tns-core-modules/utils/types");
var platform = require("tns-core-modules/platform");
var enums_1 = require("tns-core-modules/ui/enums");
firebase_common_1.firebase._messagingConnected = null;
firebase_common_1.firebase._pendingNotifications = [];
firebase_common_1.firebase._receivedPushTokenCallback = null;
firebase_common_1.firebase._gIDAuthentication = null;
firebase_common_1.firebase._cachedInvitation = null;
firebase_common_1.firebase._cachedDynamicLink = null;
firebase_common_1.firebase._configured = false;
var invokeOnRunLoop = (function () {
    var runloop = CFRunLoopGetMain();
    return function (func) {
        CFRunLoopPerformBlock(runloop, kCFRunLoopDefaultMode, func);
        CFRunLoopWakeUp(runloop);
    };
})();
firebase_common_1.firebase._addObserver = function (eventName, callback) {
    var queue = utils.ios.getter(NSOperationQueue, NSOperationQueue.mainQueue);
    return utils.ios.getter(NSNotificationCenter, NSNotificationCenter.defaultCenter).addObserverForNameObjectQueueUsingBlock(eventName, null, queue, callback);
};
var handleRemoteNotification = function (app, userInfo) {
    var userInfoJSON = firebase_common_1.firebase.toJsObject(userInfo);
    var aps = userInfo.objectForKey("aps");
    if (aps !== null) {
        var alrt = aps.objectForKey("alert");
        if (alrt !== null && alrt.objectForKey) {
            userInfoJSON.title = alrt.objectForKey("title");
            userInfoJSON.body = alrt.objectForKey("body");
        }
    }
    firebase_common_1.firebase._pendingNotifications.push(userInfoJSON);
    userInfoJSON.foreground = app.applicationState === 0;
    if (firebase_common_1.firebase._receivedNotificationCallback !== null) {
        firebase_common_1.firebase._processPendingNotifications();
    }
};
function addBackgroundRemoteNotificationHandler(appDelegate) {
    if (typeof (FIRMessaging) !== "undefined") {
        appDelegate.prototype.applicationDidReceiveRemoteNotificationFetchCompletionHandler = function (app, notification, completionHandler) {
            if (FIRAuth.auth().canHandleNotification(notification)) {
                completionHandler(1);
                return;
            }
            completionHandler(0);
            handleRemoteNotification(app, notification);
        };
    }
}
firebase_common_1.firebase.addAppDelegateMethods = function (appDelegate) {
    appDelegate.prototype.applicationDidFinishLaunchingWithOptions = function (application, launchOptions) {
        if (!firebase_common_1.firebase._configured) {
            firebase_common_1.firebase._configured = true;
            FIRApp.configure();
        }
        if (launchOptions && typeof (FIRMessaging) !== "undefined") {
            var remoteNotification = launchOptions.objectForKey(UIApplicationLaunchOptionsRemoteNotificationKey);
            if (remoteNotification) {
                handleRemoteNotification(application, remoteNotification);
            }
        }
        if (typeof (FBSDKApplicationDelegate) !== "undefined") {
            FBSDKApplicationDelegate.sharedInstance().applicationDidFinishLaunchingWithOptions(application, launchOptions);
        }
        return true;
    };
    if (typeof (FBSDKApplicationDelegate) !== "undefined" || typeof (GIDSignIn) !== "undefined" || typeof (FIRInvites) !== "undefined" || typeof (FIRDynamicLink) !== "undefined") {
        appDelegate.prototype.applicationOpenURLSourceApplicationAnnotation = function (application, url, sourceApplication, annotation) {
            var result = false;
            if (typeof (FBSDKApplicationDelegate) !== "undefined") {
                result = FBSDKApplicationDelegate.sharedInstance().applicationOpenURLSourceApplicationAnnotation(application, url, sourceApplication, annotation);
            }
            if (typeof (GIDSignIn) !== "undefined") {
                result = result || GIDSignIn.sharedInstance().handleURLSourceApplicationAnnotation(url, sourceApplication, annotation);
            }
            if (typeof (FIRInvites) !== "undefined") {
                var receivedInvite = FIRInvites.handleURLSourceApplicationAnnotation(url, sourceApplication, annotation);
                if (receivedInvite) {
                    console.log("Deep link from " + sourceApplication + ", Invite ID: " + receivedInvite.inviteId + ", App URL: " + receivedInvite.deepLink);
                    firebase_common_1.firebase._cachedInvitation = {
                        deepLink: receivedInvite.deepLink,
                        matchType: receivedInvite.matchType,
                        invitationId: receivedInvite.inviteId
                    };
                    result = true;
                }
            }
            if (typeof (FIRDynamicLink) !== "undefined") {
                var dynamicLink = FIRDynamicLinks.dynamicLinks().dynamicLinkFromCustomSchemeURL(url);
                if (dynamicLink) {
                    console.log(">>> dynamicLink.url.absoluteString: " + dynamicLink.url.absoluteString);
                    firebase_common_1.firebase._cachedDynamicLink = {
                        url: dynamicLink.url.absoluteString,
                        matchConfidence: dynamicLink.matchConfidence,
                        minimumAppVersion: dynamicLink.minimumAppVersion
                    };
                    result = true;
                }
            }
            return result;
        };
    }
    if (typeof (FBSDKApplicationDelegate) !== "undefined" || typeof (GIDSignIn) !== "undefined" || typeof (FIRDynamicLink) !== "undefined") {
        appDelegate.prototype.applicationOpenURLOptions = function (application, url, options) {
            var result = false;
            if (typeof (FBSDKApplicationDelegate) !== "undefined") {
                result = FBSDKApplicationDelegate.sharedInstance().applicationOpenURLSourceApplicationAnnotation(application, url, options.valueForKey(UIApplicationOpenURLOptionsSourceApplicationKey), options.valueForKey(UIApplicationOpenURLOptionsAnnotationKey));
            }
            if (typeof (GIDSignIn) !== "undefined") {
                result = result || GIDSignIn.sharedInstance().handleURLSourceApplicationAnnotation(url, options.valueForKey(UIApplicationOpenURLOptionsSourceApplicationKey), options.valueForKey(UIApplicationOpenURLOptionsAnnotationKey));
            }
            if (typeof (FIRDynamicLink) !== "undefined") {
                var dynamicLinks = FIRDynamicLinks.dynamicLinks();
                var dynamicLink = dynamicLinks.dynamicLinkFromCustomSchemeURL(url);
                if (dynamicLink) {
                    if (dynamicLink.url !== null) {
                        console.log(">>> dynamicLink.url.absoluteString: " + dynamicLink.url.absoluteString);
                        if (firebase_common_1.firebase._dynamicLinkCallback) {
                            firebase_common_1.firebase._dynamicLinkCallback({
                                url: dynamicLink.url.absoluteString,
                                matchConfidence: dynamicLink.matchConfidence,
                                minimumAppVersion: dynamicLink.minimumAppVersion
                            });
                        }
                        else {
                            firebase_common_1.firebase._cachedDynamicLink = {
                                url: dynamicLink.url.absoluteString,
                                matchConfidence: dynamicLink.matchConfidence,
                                minimumAppVersion: dynamicLink.minimumAppVersion
                            };
                        }
                        result = true;
                    }
                }
            }
            return result;
        };
    }
    if (typeof (FIRDynamicLink) !== "undefined") {
        appDelegate.prototype.applicationContinueUserActivityRestorationHandler = function (application, userActivity, restorationHandler) {
            var result = false;
            if (typeof (FIRDynamicLink) !== "undefined") {
                if (userActivity.webpageURL) {
                    result = FIRDynamicLinks.dynamicLinks().handleUniversalLinkCompletion(userActivity.webpageURL, function (dynamicLink, error) {
                        if (dynamicLink.url !== null) {
                            console.log(">>> dynamicLink.url.absoluteString: " + dynamicLink.url.absoluteString);
                            if (firebase_common_1.firebase._dynamicLinkCallback) {
                                firebase_common_1.firebase._dynamicLinkCallback({
                                    url: dynamicLink.url.absoluteString,
                                    matchConfidence: dynamicLink.matchConfidence,
                                    minimumAppVersion: dynamicLink.minimumAppVersion
                                });
                            }
                            else {
                                firebase_common_1.firebase._cachedDynamicLink = {
                                    url: dynamicLink.url.absoluteString,
                                    matchConfidence: dynamicLink.matchConfidence,
                                    minimumAppVersion: dynamicLink.minimumAppVersion
                                };
                            }
                        }
                    });
                }
            }
            return result;
        };
    }
    addBackgroundRemoteNotificationHandler(appDelegate);
};
firebase_common_1.firebase.fetchProvidersForEmail = function (email) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (email) !== "string") {
                reject("A parameter representing an email address is required.");
                return;
            }
            FIRAuth.auth().fetchProvidersForEmailCompletion(email, function (providerNSArray, error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(firebase_common_1.firebase.toJsObject(providerNSArray));
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.fetchProvidersForEmail: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.getCurrentPushToken = function () {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRMessaging) === "undefined") {
                reject("Enable FIRMessaging in Podfile first");
                return;
            }
            resolve(FIRMessaging.messaging().FCMToken);
        }
        catch (ex) {
            console.log("Error in firebase.getCurrentPushToken: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.addOnMessageReceivedCallback = function (callback) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRMessaging) === "undefined") {
                reject("Enable FIRMessaging in Podfile first");
                return;
            }
            firebase_common_1.firebase._receivedNotificationCallback = callback;
            firebase_common_1.firebase._registerForRemoteNotifications();
            firebase_common_1.firebase._processPendingNotifications();
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.addOnMessageReceivedCallback: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.addOnDynamicLinkReceivedCallback = function (callback) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRDynamicLink) === "undefined") {
                reject("Enable FIRInvites in Podfile first");
                return;
            }
            firebase_common_1.firebase._dynamicLinkCallback = callback;
            if (firebase_common_1.firebase._cachedDynamicLink !== null) {
                callback(firebase_common_1.firebase._cachedDynamicLink);
                firebase_common_1.firebase._cachedDynamicLink = null;
            }
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.addOnDynamicLinkReceivedCallback: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.addOnPushTokenReceivedCallback = function (callback) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRMessaging) === "undefined") {
                reject("Enable FIRMessaging in Podfile first");
                return;
            }
            firebase_common_1.firebase._receivedPushTokenCallback = callback;
            if (firebase_common_1.firebase._pushToken) {
                callback(firebase_common_1.firebase._pushToken);
            }
            firebase_common_1.firebase._registerForRemoteNotifications();
            firebase_common_1.firebase._processPendingNotifications();
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.addOnPushTokenReceivedCallback: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.unregisterForPushNotifications = function () {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRMessaging) === "undefined") {
                reject("Enable FIRMessaging in Podfile first");
                return;
            }
            utils.ios.getter(UIApplication, UIApplication.sharedApplication).unregisterForRemoteNotifications();
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.unregisterForPushNotifications: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase._processPendingNotifications = function () {
    var app = utils.ios.getter(UIApplication, UIApplication.sharedApplication);
    if (!app) {
        application.on("launch", function () {
            firebase_common_1.firebase._processPendingNotifications();
        });
        return;
    }
    if (firebase_common_1.firebase._receivedNotificationCallback !== null) {
        for (var p in firebase_common_1.firebase._pendingNotifications) {
            var userInfoJSON = firebase_common_1.firebase._pendingNotifications[p];
            if (userInfoJSON.aps && userInfoJSON.aps.alert) {
                userInfoJSON.title = userInfoJSON.aps.alert.title;
                userInfoJSON.body = userInfoJSON.aps.alert.body;
            }
            userInfoJSON.data = userInfoJSON;
            userInfoJSON.aps = undefined;
            firebase_common_1.firebase._receivedNotificationCallback(userInfoJSON);
        }
        firebase_common_1.firebase._pendingNotifications = [];
        app.applicationIconBadgeNumber = 0;
    }
};
firebase_common_1.firebase._messagingConnectWithCompletion = function () {
    return new Promise(function (resolve, reject) {
        FIRMessaging.messaging().connectWithCompletion(function (error) {
            if (error) {
                return reject(error);
            }
            firebase_common_1.firebase._messagingConnected = true;
            resolve();
        });
    });
};
firebase_common_1.firebase._onTokenRefreshNotification = function (token) {
    firebase_common_1.firebase._pushToken = token;
    if (firebase_common_1.firebase._receivedPushTokenCallback) {
        firebase_common_1.firebase._receivedPushTokenCallback(token);
    }
    firebase_common_1.firebase._messagingConnectWithCompletion();
};
firebase_common_1.firebase._registerForRemoteNotificationsRanThisSession = false;
firebase_common_1.firebase._registerForRemoteNotifications = function () {
    var app = utils.ios.getter(UIApplication, UIApplication.sharedApplication);
    if (!app) {
        application.on("launch", function () {
            firebase_common_1.firebase._registerForRemoteNotifications();
        });
        return;
    }
    if (firebase_common_1.firebase._registerForRemoteNotificationsRanThisSession) {
    }
    firebase_common_1.firebase._registerForRemoteNotificationsRanThisSession = true;
    if (parseInt(platform.device.osVersion) >= 10) {
        var authorizationOptions = 4 | 2 | 1;
        var curNotCenter = utils.ios.getter(UNUserNotificationCenter, UNUserNotificationCenter.currentNotificationCenter);
        curNotCenter.requestAuthorizationWithOptionsCompletionHandler(authorizationOptions, function (granted, error) {
            if (!error) {
                if (app === null) {
                    app = utils.ios.getter(UIApplication, UIApplication.sharedApplication);
                }
                if (app !== null) {
                    invokeOnRunLoop(function () {
                        app.registerForRemoteNotifications();
                    });
                }
            }
            else {
                console.log("Error requesting push notification auth: " + error);
            }
        });
        firebase_common_1.firebase._userNotificationCenterDelegate = UNUserNotificationCenterDelegateImpl.new().initWithCallback(function (unnotification) {
            var userInfo = unnotification.request.content.userInfo;
            var userInfoJSON = firebase_common_1.firebase.toJsObject(userInfo);
            userInfoJSON.foreground = true;
            firebase_common_1.firebase._pendingNotifications.push(userInfoJSON);
            if (firebase_common_1.firebase._receivedNotificationCallback !== null) {
                firebase_common_1.firebase._processPendingNotifications();
            }
        });
        curNotCenter.delegate = firebase_common_1.firebase._userNotificationCenterDelegate;
        firebase_common_1.firebase._firebaseRemoteMessageDelegate = FIRMessagingDelegateImpl.new().initWithCallback(function (appDataDictionary) {
            var userInfoJSON = firebase_common_1.firebase.toJsObject(appDataDictionary);
            firebase_common_1.firebase._pendingNotifications.push(userInfoJSON);
            var asJs = firebase_common_1.firebase.toJsObject(appDataDictionary.objectForKey("notification"));
            if (asJs) {
                userInfoJSON.title = asJs.title;
                userInfoJSON.body = asJs.body;
            }
            var app = utils.ios.getter(UIApplication, UIApplication.sharedApplication);
            if (app.applicationState === 0) {
                userInfoJSON.foreground = true;
                if (firebase_common_1.firebase._receivedNotificationCallback !== null) {
                    firebase_common_1.firebase._processPendingNotifications();
                }
            }
            else {
                userInfoJSON.foreground = false;
            }
        });
        FIRMessaging.messaging().remoteMessageDelegate = firebase_common_1.firebase._firebaseRemoteMessageDelegate;
    }
    else {
        var notificationTypes = 4 | 1 | 2 | 1;
        var notificationSettings = UIUserNotificationSettings.settingsForTypesCategories(notificationTypes, null);
        invokeOnRunLoop(function () {
            app.registerForRemoteNotifications();
        });
        app.registerUserNotificationSettings(notificationSettings);
    }
};
function getAppDelegate() {
    if (application.ios.delegate === undefined) {
        var UIApplicationDelegateImpl = (function (_super) {
            __extends(UIApplicationDelegateImpl, _super);
            function UIApplicationDelegateImpl() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            UIApplicationDelegateImpl.ObjCProtocols = [UIApplicationDelegate];
            return UIApplicationDelegateImpl;
        }(UIResponder));
        application.ios.delegate = UIApplicationDelegateImpl;
    }
    return application.ios.delegate;
}
function prepAppDelegate() {
    if (typeof (FIRMessaging) !== "undefined") {
        firebase_common_1.firebase._addObserver("com.firebase.iid.notif.refresh-token", function (notification) { return firebase_common_1.firebase._onTokenRefreshNotification(notification.object); });
        firebase_common_1.firebase._addObserver(UIApplicationDidFinishLaunchingNotification, function (appNotification) {
            if (applicationSettings.getBoolean("registered", false)) {
                firebase_common_1.firebase._registerForRemoteNotifications();
            }
        });
        firebase_common_1.firebase._addObserver(UIApplicationDidBecomeActiveNotification, function (appNotification) {
            firebase_common_1.firebase._processPendingNotifications();
            if (!firebase_common_1.firebase._messagingConnected) {
                firebase_common_1.firebase._messagingConnectWithCompletion();
            }
        });
        firebase_common_1.firebase._addObserver(UIApplicationDidEnterBackgroundNotification, function (appNotification) {
            if (firebase_common_1.firebase._messagingConnected) {
                FIRMessaging.messaging().disconnect();
            }
        });
        firebase_common_1.firebase._addObserver(UIApplicationWillEnterForegroundNotification, function (appNotification) {
            if (firebase_common_1.firebase._messagingConnected !== null) {
                FIRMessaging.messaging().connectWithCompletion(function (error) {
                    if (!error) {
                        firebase_common_1.firebase._messagingConnected = true;
                    }
                });
            }
        });
    }
    firebase_common_1.firebase.addAppDelegateMethods(getAppDelegate());
}
prepAppDelegate();
firebase_common_1.firebase.toJsObject = function (objCObj) {
    if (objCObj === null || typeof objCObj !== "object") {
        return objCObj;
    }
    var node, key, i, l, oKeyArr = objCObj.allKeys;
    if (oKeyArr === undefined) {
        node = [];
        for (i = 0, l = objCObj.count; i < l; i++) {
            key = objCObj.objectAtIndex(i);
            node.push(firebase_common_1.firebase.toJsObject(key));
        }
    }
    else {
        node = {};
        for (i = 0, l = oKeyArr.count; i < l; i++) {
            key = oKeyArr.objectAtIndex(i);
            var val = objCObj.valueForKey(key);
            if (val === null) {
                node[key] = null;
                continue;
            }
            switch (types.getClass(val)) {
                case 'NSArray':
                case 'NSMutableArray':
                    node[key] = firebase_common_1.firebase.toJsObject(val);
                    break;
                case 'NSDictionary':
                case 'NSMutableDictionary':
                    node[key] = firebase_common_1.firebase.toJsObject(val);
                    break;
                case 'String':
                    node[key] = String(val);
                    break;
                case 'Boolean':
                    node[key] = val;
                    break;
                case 'Number':
                case 'NSDecimalNumber':
                    node[key] = Number(String(val));
                    break;
                case 'Date':
                    node[key] = new Date(val);
                    break;
                case 'FIRDocumentReference':
                    var path = val.path;
                    var lastSlashIndex = path.lastIndexOf("/");
                    node[key] = firebase_common_1.firebase.firestore._getDocumentReference(val, path.substring(0, lastSlashIndex), path.substring(lastSlashIndex + 1));
                    break;
                case 'FIRGeoPoint':
                    node[key] = {
                        latitude: val.latitude,
                        longitude: val.longitude
                    };
                    break;
                default:
                    console.log("Please report this at https://github.com/EddyVerbruggen/nativescript-plugin-firebase/issues: iOS toJsObject is missing a converter for class '" + types.getClass(val) + "'. Casting to String as a fallback.");
                    node[key] = String(val);
            }
        }
    }
    return node;
};
firebase_common_1.firebase.getCallbackData = function (type, snapshot) {
    return {
        type: type,
        key: snapshot.key,
        value: firebase_common_1.firebase.toJsObject(snapshot.value)
    };
};
firebase_common_1.firebase.authStateListener = null;
firebase_common_1.firebase.init = function (arg) {
    return new Promise(function (resolve, reject) {
        if (firebase_common_1.firebase.initialized) {
            reject("Firebase already initialized");
        }
        firebase_common_1.firebase.initialized = true;
        try {
            try {
                if (typeof (FIRServerValue) !== "undefined") {
                    firebase_common_1.firebase.ServerValue = {
                        TIMESTAMP: FIRServerValue.timestamp()
                    };
                }
            }
            catch (ignore) {
            }
            arg = arg || {};
            if (FIROptions.defaultOptions() !== null) {
                FIROptions.defaultOptions().deepLinkURLScheme = utils.ios.getter(NSBundle, NSBundle.mainBundle).bundleIdentifier;
            }
            if (!firebase_common_1.firebase._configured) {
                firebase_common_1.firebase._configured = true;
                FIRApp.configure();
            }
            if (typeof (FIRDatabase) !== "undefined") {
                if (arg.persist) {
                    FIRDatabase.database().persistenceEnabled = true;
                }
            }
            if (typeof (FIRFirestore) !== "undefined") {
                if (arg.persist === false) {
                    var fIRFirestoreSettings = FIRFirestoreSettings.new();
                    fIRFirestoreSettings.persistenceEnabled = false;
                    FIRFirestore.firestore().settings = fIRFirestoreSettings;
                }
            }
            if (arg.iOSEmulatorFlush) {
                try {
                    FIRAuth.auth().signOut();
                }
                catch (signOutErr) {
                    console.log('Sign out of Firebase error: ' + signOutErr);
                }
            }
            if (arg.onAuthStateChanged) {
                firebase_common_1.firebase.authStateListener = function (auth, user) {
                    arg.onAuthStateChanged({
                        loggedIn: user !== null,
                        user: toLoginResult(user)
                    });
                };
                FIRAuth.auth().addAuthStateDidChangeListener(firebase_common_1.firebase.authStateListener);
            }
            if (!firebase_common_1.firebase.authStateListener) {
                firebase_common_1.firebase.authStateListener = function (auth, user) {
                    firebase_common_1.firebase.notifyAuthStateListeners({
                        loggedIn: user !== null,
                        user: toLoginResult(user)
                    });
                };
                FIRAuth.auth().addAuthStateDidChangeListener(firebase_common_1.firebase.authStateListener);
            }
            if (arg.onDynamicLinkCallback !== undefined) {
                firebase_common_1.firebase.addOnDynamicLinkReceivedCallback(arg.onDynamicLinkCallback);
            }
            if (typeof (FBSDKAppEvents) !== "undefined") {
                FBSDKAppEvents.activateApp();
            }
            if (typeof (FIRMessaging) !== "undefined") {
                if (arg.onMessageReceivedCallback !== undefined || arg.onPushTokenReceivedCallback !== undefined) {
                    if (arg.onMessageReceivedCallback !== undefined) {
                        firebase_common_1.firebase.addOnMessageReceivedCallback(arg.onMessageReceivedCallback);
                    }
                    if (arg.onPushTokenReceivedCallback !== undefined) {
                        firebase_common_1.firebase.addOnPushTokenReceivedCallback(arg.onPushTokenReceivedCallback);
                    }
                }
            }
            if (arg.storageBucket) {
                if (typeof (FIRStorage) === "undefined") {
                    reject("Uncomment Storage in the plugin's Podfile first");
                    return;
                }
                firebase_common_1.firebase.storage = FIRStorage.storage().referenceForURL(arg.storageBucket);
            }
            resolve(typeof (FIRDatabase) !== "undefined" ? FIRDatabase.database().reference() : undefined);
        }
        catch (ex) {
            console.log("Error in firebase.init: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.analytics.logEvent = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            if (arg.key === undefined) {
                reject("Argument 'key' is missing");
                return;
            }
            var dic = NSMutableDictionary.new();
            if (arg.parameters !== undefined) {
                for (var p in arg.parameters) {
                    var param = arg.parameters[p];
                    if (param.value !== undefined) {
                        dic.setObjectForKey(param.value, param.key);
                    }
                }
            }
            FIRAnalytics.logEventWithNameParameters(arg.key, dic);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.analytics.logEvent: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.analytics.setUserProperty = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            if (arg.key === undefined) {
                reject("Argument 'key' is missing");
                return;
            }
            if (arg.value === undefined) {
                reject("Argument 'value' is missing");
                return;
            }
            FIRAnalytics.setUserPropertyStringForName(arg.value, arg.key);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.analytics.setUserProperty: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.analytics.setScreenName = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            if (arg.screenName === undefined) {
                reject("Argument 'screenName' is missing");
                return;
            }
            FIRAnalytics.setScreenNameScreenClass(arg.screenName, null);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.analytics.setScreenName: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.admob.showBanner = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (GADRequest) === "undefined") {
                reject("Uncomment AdMob in the plugin's Podfile first");
                return;
            }
            if (firebase_common_1.firebase.admob.adView !== null && firebase_common_1.firebase.admob.adView !== undefined) {
                firebase_common_1.firebase.admob.adView.removeFromSuperview();
                firebase_common_1.firebase.admob.adView = null;
            }
            firebase_common_1.firebase.admob.defaults.view = utils.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.rootViewController.view;
            var settings = firebase_common_1.firebase.merge(arg, firebase_common_1.firebase.admob.defaults);
            var view = settings.view;
            var bannerType = firebase_common_1.firebase.admob._getBannerType(settings.size);
            var adWidth = bannerType.size.width === 0 ? view.frame.size.width : bannerType.size.width;
            var adHeight = bannerType.size.smartHeight ? bannerType.size.smartHeight : bannerType.size.height;
            var originX = (view.frame.size.width - adWidth) / 2;
            var originY = settings.margins.top > -1 ? settings.margins.top : (settings.margins.bottom > -1 ? view.frame.size.height - adHeight - settings.margins.bottom : 0.0);
            var origin = CGPointMake(originX, originY);
            firebase_common_1.firebase.admob.adView = GADBannerView.alloc().initWithAdSizeOrigin(bannerType, origin);
            firebase_common_1.firebase.admob.adView.adUnitID = settings.iosBannerId;
            var adRequest = GADRequest.request();
            if (settings.testing) {
                var testDevices = [];
                try {
                    testDevices.push(kGADSimulatorID);
                }
                catch (ignore) {
                }
                if (settings.iosTestDeviceIds) {
                    testDevices = testDevices.concat(settings.iosTestDeviceIds);
                }
                adRequest.testDevices = testDevices;
            }
            firebase_common_1.firebase.admob.adView.rootViewController = utils.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.rootViewController;
            firebase_common_1.firebase.admob.adView.loadRequest(adRequest);
            view.addSubview(firebase_common_1.firebase.admob.adView);
            application.on(application.orientationChangedEvent, function (data) {
                if (firebase_common_1.firebase.admob.adView !== null) {
                    firebase_common_1.firebase.admob.hideBanner().then(function (res) {
                        firebase_common_1.firebase.admob.createBanner(arg);
                    });
                }
            });
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.admob.showBanner: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.admob.showInterstitial = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (GADRequest) === "undefined") {
                reject("Uncomment AdMob in the plugin's Podfile first");
                return;
            }
            var settings = firebase_common_1.firebase.merge(arg, firebase_common_1.firebase.admob.defaults);
            firebase_common_1.firebase.admob.interstitialView = GADInterstitial.alloc().initWithAdUnitID(settings.iosInterstitialId);
            var delegate_1 = GADInterstitialDelegateImpl.new().initWithCallback(function (ad, error) {
                if (error) {
                    reject(error);
                }
                else {
                    firebase_common_1.firebase.admob.interstitialView.presentFromRootViewController(utils.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.rootViewController);
                    resolve();
                }
                CFRelease(delegate_1);
                delegate_1 = undefined;
            });
            CFRetain(delegate_1);
            firebase_common_1.firebase.admob.interstitialView.delegate = delegate_1;
            var adRequest = GADRequest.request();
            if (settings.testing) {
                var testDevices = [];
                try {
                    testDevices.push(kGADSimulatorID);
                }
                catch (ignore) {
                }
                if (settings.iosTestDeviceIds) {
                    testDevices = testDevices.concat(settings.iosTestDeviceIds);
                }
                adRequest.testDevices = testDevices;
            }
            firebase_common_1.firebase.admob.interstitialView.loadRequest(adRequest);
        }
        catch (ex) {
            console.log("Error in firebase.admob.showInterstitial: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.admob.hideBanner = function () {
    return new Promise(function (resolve, reject) {
        try {
            if (firebase_common_1.firebase.admob.adView !== null) {
                firebase_common_1.firebase.admob.adView.removeFromSuperview();
                firebase_common_1.firebase.admob.adView = null;
            }
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.admob.hideBanner: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.admob._getBannerType = function (size) {
    if (size === firebase_common_1.firebase.admob.AD_SIZE.BANNER) {
        return { "size": { "width": 320, "height": 50 }, "flags": 0 };
    }
    else if (size === firebase_common_1.firebase.admob.AD_SIZE.LARGE_BANNER) {
        return { "size": { "width": 320, "height": 100 }, "flags": 0 };
    }
    else if (size === firebase_common_1.firebase.admob.AD_SIZE.MEDIUM_RECTANGLE) {
        return { "size": { "width": 300, "height": 250 }, "flags": 0 };
    }
    else if (size === firebase_common_1.firebase.admob.AD_SIZE.FULL_BANNER) {
        return { "size": { "width": 468, "height": 60 }, "flags": 0 };
    }
    else if (size === firebase_common_1.firebase.admob.AD_SIZE.LEADERBOARD) {
        return { "size": { "width": 728, "height": 90 }, "flags": 0 };
    }
    else if (size === firebase_common_1.firebase.admob.AD_SIZE.SKYSCRAPER) {
        return { "size": { "width": 120, "height": 600 }, "flags": 0 };
    }
    else if (size === firebase_common_1.firebase.admob.AD_SIZE.SMART_BANNER || size === firebase_common_1.firebase.admob.AD_SIZE.FLUID) {
        var orientation_1 = utils.ios.getter(UIDevice, UIDevice.currentDevice).orientation;
        var isIPad = platform.device.deviceType === enums_1.DeviceType.Tablet;
        if (orientation_1 === 1 || orientation_1 === 2) {
            return { "size": { "width": 0, "height": 0, "smartHeight": isIPad ? 90 : 50 }, "flags": 18 };
        }
        else {
            return { "size": { "width": 0, "height": 0, "smartHeight": isIPad ? 90 : 32 }, "flags": 26 };
        }
    }
    else {
        return { "size": { "width": -1, "height": -1 }, "flags": 0 };
    }
};
firebase_common_1.firebase.getRemoteConfig = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRRemoteConfig) === "undefined") {
                reject("Uncomment RemoteConfig in the plugin's Podfile first");
                return;
            }
            if (arg.properties === undefined) {
                reject("Argument 'properties' is missing");
                return;
            }
            var firebaseRemoteConfig_1 = FIRRemoteConfig.remoteConfig();
            firebaseRemoteConfig_1.configSettings = new FIRRemoteConfigSettings({ developerModeEnabled: arg.developerMode || false });
            var dic = NSMutableDictionary.new();
            for (var p in arg.properties) {
                var prop = arg.properties[p];
                if (prop.default !== undefined) {
                    dic.setObjectForKey(prop.default, prop.key);
                }
            }
            firebaseRemoteConfig_1.setDefaults(dic);
            var onCompletion = function (remoteConfigFetchStatus, error) {
                if (remoteConfigFetchStatus === 1 ||
                    remoteConfigFetchStatus === 3) {
                    var activated = firebaseRemoteConfig_1.activateFetched();
                    var result = {
                        lastFetch: firebaseRemoteConfig_1.lastFetchTime,
                        throttled: remoteConfigFetchStatus === 3,
                        properties: {}
                    };
                    for (var p in arg.properties) {
                        var prop = arg.properties[p];
                        var key = prop.key;
                        var value = firebaseRemoteConfig_1.configValueForKey(key).stringValue;
                        result.properties[key] = firebase_common_1.firebase.strongTypeify(value);
                    }
                    resolve(result);
                }
                else {
                    reject(error.localizedDescription);
                }
            };
            var expirationDuration = arg.cacheExpirationSeconds || 43200;
            firebaseRemoteConfig_1.fetchWithExpirationDurationCompletionHandler(expirationDuration, onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.getRemoteConfig: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.getCurrentUser = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var fAuth = FIRAuth.auth();
            if (fAuth === null) {
                reject("Run init() first!");
                return;
            }
            var user = fAuth.currentUser;
            if (user) {
                resolve(toLoginResult(user));
            }
            else {
                reject();
            }
        }
        catch (ex) {
            console.log("Error in firebase.getCurrentUser: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.sendEmailVerification = function () {
    return new Promise(function (resolve, reject) {
        try {
            var fAuth = FIRAuth.auth();
            if (fAuth === null) {
                reject("Run init() first!");
                return;
            }
            var user = fAuth.currentUser;
            if (user) {
                var onCompletion = function (error) {
                    if (error) {
                        reject(error.localizedDescription);
                    }
                    else {
                        resolve(true);
                    }
                };
                user.sendEmailVerificationWithCompletion(onCompletion);
            }
            else {
                reject("Log in first");
            }
        }
        catch (ex) {
            console.log("Error in firebase.sendEmailVerification: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.logout = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            FIRAuth.auth().signOut();
            if (typeof (GIDSignIn) !== "undefined") {
                GIDSignIn.sharedInstance().disconnect();
            }
            if (typeof (FBSDKLoginManager) !== "undefined") {
                FBSDKLoginManager.alloc().logOut();
            }
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.logout: " + ex);
            reject(ex);
        }
    });
};
function toLoginResult(user) {
    if (!user) {
        return false;
    }
    var providers = [];
    for (var i = 0, l = user.providerData.count; i < l; i++) {
        var firUserInfo = user.providerData.objectAtIndex(i);
        var pid = firUserInfo.valueForKey("providerID");
        if (pid === 'facebook.com' && typeof (FBSDKAccessToken) !== "undefined") {
            var fbCurrentAccessToken = FBSDKAccessToken.currentAccessToken();
            providers.push({ id: pid, token: fbCurrentAccessToken ? fbCurrentAccessToken.tokenString : null });
        }
        else {
            providers.push({ id: pid });
        }
    }
    return {
        uid: user.uid,
        anonymous: user.anonymous,
        isAnonymous: user.anonymous,
        providers: providers,
        profileImageURL: user.photoURL ? user.photoURL.absoluteString : null,
        email: user.email,
        emailVerified: user.emailVerified,
        name: user.displayName,
        phoneNumber: user.phoneNumber,
        refreshToken: user.refreshToken
    };
}
firebase_common_1.firebase.getAuthToken = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var fAuth = FIRAuth.auth();
            if (fAuth === null) {
                reject("Run init() first!");
                return;
            }
            var user = fAuth.currentUser;
            if (user) {
                var onCompletion = function (token, error) {
                    if (error) {
                        reject(error.localizedDescription);
                    }
                    else {
                        resolve(token);
                    }
                };
                user.getTokenForcingRefreshCompletion(arg.forceRefresh, onCompletion);
            }
            else {
                reject("Log in first");
            }
        }
        catch (ex) {
            console.log("Error in firebase.getAuthToken: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.login = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var onCompletion_1 = function (user, error) {
                if (error) {
                    if (typeof (GIDSignIn) !== "undefined") {
                        GIDSignIn.sharedInstance().disconnect();
                    }
                    reject(error.localizedDescription);
                }
                else {
                    resolve(toLoginResult(user));
                    firebase_common_1.firebase.notifyAuthStateListeners({
                        loggedIn: true,
                        user: user
                    });
                }
            };
            var fAuth_1 = FIRAuth.auth();
            if (fAuth_1 === null) {
                reject("Run init() first!");
                return;
            }
            firebase_common_1.firebase.moveLoginOptionsToObjects(arg);
            if (arg.type === firebase_common_1.firebase.LoginType.ANONYMOUS) {
                fAuth_1.signInAnonymouslyWithCompletion(onCompletion_1);
            }
            else if (arg.type === firebase_common_1.firebase.LoginType.PASSWORD) {
                if (!arg.passwordOptions || !arg.passwordOptions.email || !arg.passwordOptions.password) {
                    reject("Auth type PASSWORD requires an 'passwordOptions.email' and 'passwordOptions.password' argument");
                    return;
                }
                var fIRAuthCredential_1 = FIREmailAuthProvider.credentialWithEmailPassword(arg.passwordOptions.email, arg.passwordOptions.password);
                if (fAuth_1.currentUser) {
                    var onCompletionLink = function (user, error) {
                        if (error) {
                            log("--- linking error: " + error.localizedDescription);
                            fAuth_1.signInWithCredentialCompletion(fIRAuthCredential_1, onCompletion_1);
                        }
                        else {
                            onCompletion_1(user);
                        }
                    };
                    fAuth_1.currentUser.linkWithCredentialCompletion(fIRAuthCredential_1, onCompletionLink);
                }
                else {
                    fAuth_1.signInWithEmailPasswordCompletion(arg.passwordOptions.email, arg.passwordOptions.password, onCompletion_1);
                }
            }
            else if (arg.type === firebase_common_1.firebase.LoginType.PHONE) {
                if (!arg.phoneOptions || !arg.phoneOptions.phoneNumber) {
                    reject("Auth type PHONE requires a 'phoneOptions.phoneNumber' argument");
                    return;
                }
                FIRPhoneAuthProvider.provider().verifyPhoneNumberCompletion(arg.phoneOptions.phoneNumber, function (verificationID, error) {
                    if (error) {
                        reject(error.localizedDescription);
                        return;
                    }
                    firebase_common_1.firebase.requestPhoneAuthVerificationCode(function (userResponse) {
                        var fIRAuthCredential = FIRPhoneAuthProvider.provider().credentialWithVerificationIDVerificationCode(verificationID, userResponse);
                        if (fAuth_1.currentUser) {
                            var onCompletionLink = function (user, error) {
                                if (error) {
                                    fAuth_1.signInWithCredentialCompletion(fIRAuthCredential, onCompletion_1);
                                }
                                else {
                                    onCompletion_1(user);
                                }
                            };
                            fAuth_1.currentUser.linkWithCredentialCompletion(fIRAuthCredential, onCompletionLink);
                        }
                        else {
                            fAuth_1.signInWithCredentialCompletion(fIRAuthCredential, onCompletion_1);
                        }
                    }, arg.phoneOptions.verificationPrompt);
                });
            }
            else if (arg.type === firebase_common_1.firebase.LoginType.CUSTOM) {
                if (!arg.customOptions || (!arg.customOptions.token && !arg.customOptions.tokenProviderFn)) {
                    reject("Auth type CUSTOM requires a 'customOptions.token' or 'customOptions.tokenProviderFn' argument");
                    return;
                }
                if (arg.customOptions.token) {
                    fAuth_1.signInWithCustomTokenCompletion(arg.customOptions.token, onCompletion_1);
                }
                else if (arg.customOptions.tokenProviderFn) {
                    arg.customOptions.tokenProviderFn()
                        .then(function (token) {
                        fAuth_1.signInWithCustomTokenCompletion(token, onCompletion_1);
                    }, function (error) {
                        reject(error);
                    });
                }
            }
            else if (arg.type === firebase_common_1.firebase.LoginType.FACEBOOK) {
                if (typeof (FBSDKLoginManager) === "undefined") {
                    reject("Facebook SDK not installed - see Podfile");
                    return;
                }
                var onFacebookCompletion = function (fbSDKLoginManagerLoginResult, error) {
                    if (error) {
                        console.log("Facebook login error " + error);
                        reject(error.localizedDescription);
                    }
                    else if (fbSDKLoginManagerLoginResult.isCancelled) {
                        reject("login cancelled");
                    }
                    else {
                        var fIRAuthCredential_2 = FIRFacebookAuthProvider.credentialWithAccessToken(FBSDKAccessToken.currentAccessToken().tokenString);
                        if (fAuth_1.currentUser) {
                            var onCompletionLink = function (user, error) {
                                if (error) {
                                    log("--- linking error: " + error.localizedDescription);
                                    fAuth_1.signInWithCredentialCompletion(fIRAuthCredential_2, onCompletion_1);
                                }
                                else {
                                    onCompletion_1(user);
                                }
                            };
                            fAuth_1.currentUser.linkWithCredentialCompletion(fIRAuthCredential_2, onCompletionLink);
                        }
                        else {
                            fAuth_1.signInWithCredentialCompletion(fIRAuthCredential_2, onCompletion_1);
                        }
                    }
                };
                var fbSDKLoginManager = FBSDKLoginManager.new();
                var scope = ["public_profile", "email"];
                if (arg.facebookOptions && arg.facebookOptions.scope) {
                    scope = arg.facebookOptions.scope;
                }
                fbSDKLoginManager.logInWithReadPermissionsFromViewControllerHandler(scope, null, onFacebookCompletion);
            }
            else if (arg.type === firebase_common_1.firebase.LoginType.GOOGLE) {
                if (typeof (GIDSignIn) === "undefined") {
                    reject("Google Sign In not installed - see Podfile");
                    return;
                }
                var sIn = GIDSignIn.sharedInstance();
                sIn.uiDelegate = application.ios.rootController;
                sIn.clientID = FIRApp.defaultApp().options.clientID;
                if (arg.googleOptions && arg.googleOptions.hostedDomain) {
                    sIn.hostedDomain = arg.googleOptions.hostedDomain;
                }
                var delegate_2 = GIDSignInDelegateImpl.new().initWithCallback(function (user, error) {
                    if (error === null) {
                        firebase_common_1.firebase._gIDAuthentication = user.authentication;
                        var fIRAuthCredential_3 = FIRGoogleAuthProvider.credentialWithIDTokenAccessToken(firebase_common_1.firebase._gIDAuthentication.idToken, firebase_common_1.firebase._gIDAuthentication.accessToken);
                        if (fAuth_1.currentUser) {
                            var onCompletionLink = function (user, error) {
                                if (error) {
                                    fAuth_1.signInWithCredentialCompletion(fIRAuthCredential_3, onCompletion_1);
                                }
                                else {
                                    onCompletion_1(user);
                                }
                            };
                            fAuth_1.currentUser.linkWithCredentialCompletion(fIRAuthCredential_3, onCompletionLink);
                        }
                        else {
                            fAuth_1.signInWithCredentialCompletion(fIRAuthCredential_3, onCompletion_1);
                        }
                    }
                    else {
                        reject(error.localizedDescription);
                    }
                    CFRelease(delegate_2);
                    delegate_2 = undefined;
                });
                CFRetain(delegate_2);
                sIn.delegate = delegate_2;
                sIn.signIn();
            }
            else {
                reject("Unsupported auth type: " + arg.type);
            }
        }
        catch (ex) {
            console.log("Error in firebase.login: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.reauthenticate = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var fAuth = FIRAuth.auth();
            if (fAuth === null) {
                reject("Run init() first!");
                return;
            }
            var user = fAuth.currentUser;
            if (user === null) {
                reject("no current user");
                return;
            }
            firebase_common_1.firebase.moveLoginOptionsToObjects(arg);
            var authCredential = null;
            if (arg.type === firebase_common_1.firebase.LoginType.PASSWORD) {
                if (!arg.passwordOptions || !arg.passwordOptions.email || !arg.passwordOptions.password) {
                    reject("Auth type PASSWORD requires an 'passwordOptions.email' and 'passwordOptions.password' argument");
                    return;
                }
                authCredential = FIREmailAuthProvider.credentialWithEmailPassword(arg.passwordOptions.email, arg.passwordOptions.password);
            }
            else if (arg.type === firebase_common_1.firebase.LoginType.GOOGLE) {
                if (!firebase_common_1.firebase._gIDAuthentication) {
                    reject("Not currently logged in with Google");
                    return;
                }
                authCredential = FIRGoogleAuthProvider.credentialWithIDTokenAccessToken(firebase_common_1.firebase._gIDAuthentication.idToken, firebase_common_1.firebase._gIDAuthentication.accessToken);
            }
            else if (arg.type === firebase_common_1.firebase.LoginType.FACEBOOK) {
                var currentAccessToken = FBSDKAccessToken.currentAccessToken();
                if (!currentAccessToken) {
                    reject("Not currently logged in with Facebook");
                    return;
                }
                authCredential = FIRFacebookAuthProvider.credentialWithAccessToken(currentAccessToken.tokenString);
            }
            if (authCredential === null) {
                reject("arg.type should be one of LoginType.PASSWORD | LoginType.GOOGLE | LoginType.FACEBOOK");
                return;
            }
            var onCompletion = function (error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            user.reauthenticateWithCredentialCompletion(authCredential, onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.reauthenticate: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.reloadUser = function () {
    return new Promise(function (resolve, reject) {
        try {
            var user = FIRAuth.auth().currentUser;
            if (user === null) {
                reject("no current user");
                return;
            }
            var onCompletion = function (error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            user.reloadWithCompletion(onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.reloadUser: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.resetPassword = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var onCompletion = function (error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            if (!arg.email) {
                reject("Resetting a password requires an email argument");
            }
            else {
                FIRAuth.auth().sendPasswordResetWithEmailCompletion(arg.email, onCompletion);
            }
        }
        catch (ex) {
            console.log("Error in firebase.resetPassword: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.changePassword = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var onCompletion = function (error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            if (!arg.email || !arg.oldPassword || !arg.newPassword) {
                reject("Changing a password requires an email and an oldPassword and a newPassword arguments");
            }
            else {
                var user = FIRAuth.auth().currentUser;
                if (user === null) {
                    reject("no current user");
                }
                else {
                    user.updatePasswordCompletion(arg.newPassword, onCompletion);
                }
            }
        }
        catch (ex) {
            console.log("Error in firebase.changePassword: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.createUser = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var onCompletion = function (user, error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve({
                        key: user.uid
                    });
                }
            };
            if (!arg.email || !arg.password) {
                reject("Creating a user requires an email and password argument");
            }
            else {
                FIRAuth.auth().createUserWithEmailPasswordCompletion(arg.email, arg.password, onCompletion);
            }
        }
        catch (ex) {
            console.log("Error in firebase.createUser: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.deleteUser = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var user = FIRAuth.auth().currentUser;
            if (user === null) {
                reject("no current user");
                return;
            }
            var onCompletion = function (error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            user.deleteWithCompletion(onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.deleteUser: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.updateProfile = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var onCompletion = function (error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            var fAuth = FIRAuth.auth();
            if (fAuth === null) {
                reject("Run init() first!");
                return;
            }
            if (!arg.displayName && !arg.photoURL) {
                reject("Updating a profile requires a displayName and / or a photoURL argument");
            }
            else {
                var user = fAuth.currentUser;
                if (user) {
                    var changeRequest = user.profileChangeRequest();
                    changeRequest.displayName = arg.displayName;
                    changeRequest.photoURL = NSURL.URLWithString(arg.photoURL);
                    changeRequest.commitChangesWithCompletion(onCompletion);
                }
                else {
                    reject();
                }
            }
        }
        catch (ex) {
            console.log("Error in firebase.updateProfile: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase._addObservers = function (to, updateCallback) {
    var listeners = [];
    listeners.push(to.observeEventTypeWithBlock(0, function (snapshot) {
        updateCallback(firebase_common_1.firebase.getCallbackData('ChildAdded', snapshot));
    }));
    listeners.push(to.observeEventTypeWithBlock(1, function (snapshot) {
        updateCallback(firebase_common_1.firebase.getCallbackData('ChildRemoved', snapshot));
    }));
    listeners.push(to.observeEventTypeWithBlock(2, function (snapshot) {
        updateCallback(firebase_common_1.firebase.getCallbackData('ChildChanged', snapshot));
    }));
    listeners.push(to.observeEventTypeWithBlock(3, function (snapshot) {
        updateCallback(firebase_common_1.firebase.getCallbackData('ChildMoved', snapshot));
    }));
    return listeners;
};
firebase_common_1.firebase.keepInSync = function (path, switchOn) {
    return new Promise(function (resolve, reject) {
        try {
            var where = FIRDatabase.database().reference().childByAppendingPath(path);
            where.keepSynced(switchOn);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.keepInSync: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.addChildEventListener = function (updateCallback, path) {
    return new Promise(function (resolve, reject) {
        try {
            var where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().childByAppendingPath(path);
            resolve({
                path: path,
                listeners: firebase_common_1.firebase._addObservers(where, updateCallback)
            });
        }
        catch (ex) {
            console.log("Error in firebase.addChildEventListener: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.addValueEventListener = function (updateCallback, path) {
    return new Promise(function (resolve, reject) {
        try {
            var where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().childByAppendingPath(path);
            var listener = where.observeEventTypeWithBlockWithCancelBlock(4, function (snapshot) {
                updateCallback(firebase_common_1.firebase.getCallbackData('ValueChanged', snapshot));
            }, function (firebaseError) {
                updateCallback({
                    error: firebaseError.localizedDescription
                });
            });
            resolve({
                path: path,
                listeners: [listener]
            });
        }
        catch (ex) {
            console.log("Error in firebase.addChildEventListener: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.getValue = function (path) {
    return new Promise(function (resolve, reject) {
        try {
            var where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().childByAppendingPath(path);
            var listener = where.observeSingleEventOfTypeWithBlockWithCancelBlock(4, function (snapshot) {
                resolve(firebase_common_1.firebase.getCallbackData('ValueChanged', snapshot));
            }, function (firebaseError) {
                reject(firebaseError.localizedDescription);
            });
        }
        catch (ex) {
            console.log("Error in firebase.getValue: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.removeEventListeners = function (listeners, path) {
    return new Promise(function (resolve, reject) {
        try {
            var where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().childByAppendingPath(path);
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                where.removeObserverWithHandle(listener);
            }
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.removeEventListeners: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.push = function (path, val) {
    return new Promise(function (resolve, reject) {
        try {
            var ref = FIRDatabase.database().reference().childByAppendingPath(path).childByAutoId();
            ref.setValue(val);
            resolve({
                key: ref.key
            });
        }
        catch (ex) {
            console.log("Error in firebase.push: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.setValue = function (path, val) {
    return new Promise(function (resolve, reject) {
        try {
            FIRDatabase.database().reference().childByAppendingPath(path).setValue(val);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.setValue: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.update = function (path, val) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof val === "object") {
                FIRDatabase.database().reference().childByAppendingPath(path).updateChildValues(val);
            }
            else {
                var lastPartOfPath = path.lastIndexOf("/");
                var pathPrefix = path.substring(0, lastPartOfPath);
                var pathSuffix = path.substring(lastPartOfPath + 1);
                var updateObject = '{"' + pathSuffix + '" : "' + val + '"}';
                FIRDatabase.database().reference().childByAppendingPath(pathPrefix).updateChildValues(JSON.parse(updateObject));
            }
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.update: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.query = function (updateCallback, path, options) {
    return new Promise(function (resolve, reject) {
        try {
            var where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().childByAppendingPath(path);
            var query = void 0;
            if (options.orderBy.type === firebase_common_1.firebase.QueryOrderByType.KEY) {
                query = where.queryOrderedByKey();
            }
            else if (options.orderBy.type === firebase_common_1.firebase.QueryOrderByType.VALUE) {
                query = where.queryOrderedByValue();
            }
            else if (options.orderBy.type === firebase_common_1.firebase.QueryOrderByType.PRIORITY) {
                query = where.queryOrderedByPriority();
            }
            else if (options.orderBy.type === firebase_common_1.firebase.QueryOrderByType.CHILD) {
                if (options.orderBy.value === undefined || options.orderBy.value === null) {
                    reject("When orderBy.type is 'child' you must set orderBy.value as well.");
                    return;
                }
                query = where.queryOrderedByChild(options.orderBy.value);
            }
            else {
                reject("Invalid orderBy.type, use constants like firebase.QueryOrderByType.VALUE");
                return;
            }
            if (options.range && options.range.type) {
                if (options.range.type === firebase_common_1.firebase.QueryRangeType.START_AT) {
                    query = query.queryStartingAtValue(options.range.value);
                }
                else if (options.range.type === firebase_common_1.firebase.QueryRangeType.END_AT) {
                    query = query.queryEndingAtValue(options.range.value);
                }
                else if (options.range.type === firebase_common_1.firebase.QueryRangeType.EQUAL_TO) {
                    query = query.queryEqualToValue(options.range.value);
                }
                else {
                    reject("Invalid range.type, use constants like firebase.QueryRangeType.START_AT");
                    return;
                }
            }
            if (options.ranges) {
                for (var i = 0; i < options.ranges.length; i++) {
                    var range = options.ranges[i];
                    if (range.value === undefined || range.value === null) {
                        reject("Please set ranges[" + i + "].value");
                        return;
                    }
                    if (range.type === firebase_common_1.firebase.QueryRangeType.START_AT) {
                        query = query.queryStartingAtValue(range.value);
                    }
                    else if (range.type === firebase_common_1.firebase.QueryRangeType.END_AT) {
                        query = query.queryEndingAtValue(range.value);
                    }
                    else if (range.type === firebase_common_1.firebase.QueryRangeType.EQUAL_TO) {
                        query = query.queryEqualToValue(range.value);
                    }
                    else {
                        reject("Invalid ranges[" + i + "].type, use constants like firebase.QueryRangeType.START_AT");
                        return;
                    }
                }
            }
            if (options.limit && options.limit.type) {
                if (options.limit.value === undefined || options.limit.value === null) {
                    reject("Please set limit.value");
                    return;
                }
                if (options.limit.type === firebase_common_1.firebase.QueryLimitType.FIRST) {
                    query = query.queryLimitedToFirst(options.limit.value);
                }
                else if (options.limit.type === firebase_common_1.firebase.QueryLimitType.LAST) {
                    query = query.queryLimitedToLast(options.limit.value);
                }
                else {
                    reject("Invalid limit.type, use constants like firebase.queryOptions.limitType.FIRST");
                    return;
                }
            }
            if (options.singleEvent) {
                query.observeSingleEventOfTypeWithBlock(4, function (snapshot) {
                    if (updateCallback)
                        updateCallback(firebase_common_1.firebase.getCallbackData('ValueChanged', snapshot));
                    resolve(firebase_common_1.firebase.getCallbackData('ValueChanged', snapshot));
                });
            }
            else {
                resolve({
                    path: path,
                    listeners: firebase_common_1.firebase._addObservers(query, updateCallback)
                });
            }
        }
        catch (ex) {
            console.log("Error in firebase.query: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.remove = function (path) {
    return new Promise(function (resolve, reject) {
        try {
            FIRDatabase.database().reference().childByAppendingPath(path).setValue(null);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.remove: " + ex);
            reject(ex);
        }
    });
};
function getStorageRef(reject, arg) {
    if (typeof (FIRStorage) === "undefined") {
        reject("Uncomment Storage in the plugin's Podfile first");
        return;
    }
    if (!arg.remoteFullPath) {
        reject("remoteFullPath is mandatory");
        return;
    }
    return arg.bucket ? FIRStorage.storage().referenceForURL(arg.bucket) : firebase_common_1.firebase.storage;
}
firebase_common_1.firebase.uploadFile = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var onCompletion = function (metadata, error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve({
                        name: metadata.name,
                        url: metadata.downloadURL() ? metadata.downloadURL().absoluteString : null,
                        contentType: metadata.contentType,
                        created: metadata.timeCreated,
                        updated: metadata.updated,
                        bucket: metadata.bucket,
                        size: metadata.size
                    });
                }
            };
            var storageRef = getStorageRef(reject, arg);
            if (!storageRef) {
                return;
            }
            var fIRStorageReference = storageRef.child(arg.remoteFullPath);
            var fIRStorageUploadTask = null;
            if (arg.localFile) {
                if (typeof (arg.localFile) !== "object") {
                    reject("localFile argument must be a File object; use file-system module to create one");
                    return;
                }
                fIRStorageUploadTask = fIRStorageReference.putFileMetadataCompletion(NSURL.fileURLWithPath(arg.localFile.path), null, onCompletion);
            }
            else if (arg.localFullPath) {
                fIRStorageUploadTask = fIRStorageReference.putFileMetadataCompletion(NSURL.fileURLWithPath(arg.localFullPath), null, onCompletion);
            }
            else {
                reject("One of localFile or localFullPath is required");
                return;
            }
            if (fIRStorageUploadTask !== null) {
                var fIRStorageHandle = fIRStorageUploadTask.observeStatusHandler(2, function (snapshot) {
                    if (!snapshot.error && typeof (arg.onProgress) === "function") {
                        arg.onProgress({
                            fractionCompleted: snapshot.progress.fractionCompleted,
                            percentageCompleted: Math.round(snapshot.progress.fractionCompleted * 100)
                        });
                    }
                });
            }
        }
        catch (ex) {
            console.log("Error in firebase.uploadFile: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.downloadFile = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var onCompletion = function (url, error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(url.absoluteString);
                }
            };
            var storageRef = getStorageRef(reject, arg);
            if (!storageRef) {
                return;
            }
            var fIRStorageReference = storageRef.child(arg.remoteFullPath);
            var localFilePath = void 0;
            if (arg.localFile) {
                if (typeof (arg.localFile) !== "object") {
                    reject("localFile argument must be a File object; use file-system module to create one");
                    return;
                }
                localFilePath = arg.localFile.path;
            }
            else if (arg.localFullPath) {
                localFilePath = arg.localFullPath;
            }
            else {
                reject("One of localFile or localFullPath is required");
                return;
            }
            var localFileUrl = NSURL.fileURLWithPath(localFilePath);
            var fIRStorageDownloadTask = fIRStorageReference.writeToFileCompletion(localFileUrl, onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.downloadFile: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.getDownloadUrl = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var onCompletion = function (url, error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(url.absoluteString);
                }
            };
            var storageRef = getStorageRef(reject, arg);
            if (!storageRef) {
                return;
            }
            var fIRStorageReference = storageRef.child(arg.remoteFullPath);
            fIRStorageReference.downloadURLWithCompletion(onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.getDownloadUrl: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.deleteFile = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            var onCompletion = function (error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            var storageRef = getStorageRef(reject, arg);
            if (!storageRef) {
                return;
            }
            var fIRStorageFileRef = storageRef.child(arg.remoteFullPath);
            fIRStorageFileRef.deleteWithCompletion(onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.deleteFile: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.subscribeToTopic = function (topicName) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRMessaging) === "undefined") {
                reject("Enable FIRMessaging in Podfile first");
                return;
            }
            if (topicName.indexOf("/topics/") === -1) {
                topicName = "/topics/" + topicName;
            }
            FIRMessaging.messaging().subscribeToTopic(topicName);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.subscribeToTopic: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.unsubscribeFromTopic = function (topicName) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRMessaging) === "undefined") {
                reject("Enable FIRMessaging in Podfile first");
                return;
            }
            if (topicName.indexOf("/topics/") === -1) {
                topicName = "/topics/" + topicName;
            }
            FIRMessaging.messaging().unsubscribeFromTopic(topicName);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.unsubscribeFromTopic: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.sendCrashLog = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.sendCrashLog: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.invites.sendInvitation = function (arg) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRInvites) === "undefined") {
                reject("Make sure 'Firebase/Invites' is in the plugin's Podfile");
                return;
            }
            if (!arg.message || !arg.title) {
                reject("The mandatory 'message' or 'title' argument is missing");
                return;
            }
            var inviteDialog = FIRInvites.inviteDialog();
            inviteDialog.performSelectorWithObject("setMessage:", arg.message);
            inviteDialog.performSelectorWithObject("setTitle:", arg.title);
            if (arg.deepLink) {
                inviteDialog.performSelectorWithObject("setDeepLink:", arg.deeplink);
            }
            if (arg.callToActionText) {
                inviteDialog.performSelectorWithObject("setCallToActionText:", arg.callToActionText);
            }
            if (arg.customImage) {
                inviteDialog.performSelectorWithObject("setCustomImage:", arg.customImage);
            }
            if (arg.androidClientID) {
                var targetApplication = FIRInvitesTargetApplication.new();
                targetApplication.androidClientID = arg.androidClientID;
                inviteDialog.performSelectorWithObject("setOtherPlatformsTargetApplication:", targetApplication);
            }
            var delegate_3 = FIRInviteDelegateImpl.new().initWithCallback(function (invitationIds, error) {
                if (error === null) {
                    var ids = firebase_common_1.firebase.toJsObject(invitationIds);
                    resolve({
                        count: invitationIds.count,
                        invitationIds: ids
                    });
                }
                else {
                    reject(error.localizedDescription);
                }
                CFRelease(delegate_3);
                delegate_3 = undefined;
            });
            CFRetain(delegate_3);
            inviteDialog.performSelectorWithObject("setInviteDelegate:", delegate_3);
            inviteDialog.performSelector("open");
        }
        catch (ex) {
            console.log("Error in firebase.sendInvitation: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.invites.getInvitation = function () {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRInvites) === "undefined") {
                reject("Make sure 'Firebase/Invites' is in the plugin's Podfile");
                return;
            }
            if (firebase_common_1.firebase._cachedInvitation !== null) {
                resolve(firebase_common_1.firebase._cachedInvitation);
                firebase_common_1.firebase.cachedInvitation = null;
            }
            else {
                reject("Not launched by invitation");
            }
        }
        catch (ex) {
            console.log("Error in firebase.getInvitation: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.firestore.collection = function (collectionPath) {
    try {
        if (typeof (FIRFirestore) === "undefined") {
            console.log("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
            return null;
        }
        var fIRCollectionReference_1 = FIRFirestore.firestore().collectionWithPath(collectionPath);
        return {
            id: fIRCollectionReference_1.collectionID,
            doc: function (documentPath) { return firebase_common_1.firebase.firestore.doc(collectionPath, documentPath); },
            add: function (document) { return firebase_common_1.firebase.firestore.add(collectionPath, document); },
            get: function () { return firebase_common_1.firebase.firestore.get(collectionPath); },
            where: function (fieldPath, opStr, value) { return firebase_common_1.firebase.firestore.where(collectionPath, fieldPath, opStr, value); },
            orderBy: function (fieldPath, directionStr) { return firebase_common_1.firebase.firestore.orderBy(collectionPath, fieldPath, directionStr, fIRCollectionReference_1); },
            limit: function (limit) { return firebase_common_1.firebase.firestore.limit(collectionPath, limit, fIRCollectionReference_1); },
            onSnapshot: function (callback) { return firebase_common_1.firebase.firestore.onCollectionSnapshot(fIRCollectionReference_1, callback); }
        };
    }
    catch (ex) {
        console.log("Error in firebase.firestore.collection: " + ex);
        return null;
    }
};
firebase_common_1.firebase.firestore.onDocumentSnapshot = function (docRef, callback) {
    var listener = docRef.addSnapshotListener(function (snapshot, error) {
        callback(new firebase_common_1.DocumentSnapshot(snapshot ? snapshot.documentID : null, !!snapshot, snapshot ? function () { return firebase_common_1.firebase.toJsObject(snapshot.data()); } : null));
    });
    if (listener.remove === undefined) {
        return function () {
            callback = function () {
            };
        };
    }
    else {
        return function () { return listener.remove(); };
    }
};
firebase_common_1.firebase.firestore.onCollectionSnapshot = function (colRef, callback) {
    var listener = colRef.addSnapshotListener(function (snapshot, error) {
        var docSnapshots = [];
        var _loop_1 = function (i, l) {
            var document_1 = snapshot.documents.objectAtIndex(i);
            docSnapshots.push(new firebase_common_1.DocumentSnapshot(document_1.documentID, true, function () { return firebase_common_1.firebase.toJsObject(document_1.data()); }));
        };
        for (var i = 0, l = snapshot.documents.count; i < l; i++) {
            _loop_1(i, l);
        }
        var snap = new firebase_common_1.QuerySnapshot();
        snap.docSnapshots = docSnapshots;
        callback(snap);
    });
    if (listener.remove === undefined) {
        return function () {
            callback = function () {
            };
        };
    }
    else {
        return function () { return listener.remove(); };
    }
};
firebase_common_1.firebase.firestore._getDocumentReference = function (fIRDocumentReference, collectionPath, documentPath) {
    return {
        id: fIRDocumentReference.documentID,
        collection: function (cp) { return firebase_common_1.firebase.firestore.collection(collectionPath + "/" + documentPath + "/" + cp); },
        set: function (data, options) { return firebase_common_1.firebase.firestore.set(collectionPath, fIRDocumentReference.documentID, data, options); },
        get: function () { return firebase_common_1.firebase.firestore.getDocument(collectionPath, fIRDocumentReference.documentID); },
        update: function (data) { return firebase_common_1.firebase.firestore.update(collectionPath, fIRDocumentReference.documentID, data); },
        delete: function () { return firebase_common_1.firebase.firestore.delete(collectionPath, fIRDocumentReference.documentID); },
        onSnapshot: function (callback) { return firebase_common_1.firebase.firestore.onDocumentSnapshot(fIRDocumentReference, callback); },
        ios: fIRDocumentReference
    };
};
firebase_common_1.firebase.firestore.doc = function (collectionPath, documentPath) {
    try {
        if (typeof (FIRFirestore) === "undefined") {
            console.log("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
            return null;
        }
        var fIRCollectionReference = FIRFirestore.firestore().collectionWithPath(collectionPath);
        var fIRDocumentReference = documentPath ? fIRCollectionReference.documentWithPath(documentPath) : fIRCollectionReference.documentWithAutoID();
        return firebase_common_1.firebase.firestore._getDocumentReference(fIRDocumentReference, collectionPath, documentPath);
    }
    catch (ex) {
        console.log("Error in firebase.firestore.doc: " + ex);
        return null;
    }
};
firebase_common_1.firebase.firestore.add = function (collectionPath, document) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRFirestore) === "undefined") {
                reject("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
                return;
            }
            var defaultFirestore = FIRFirestore.firestore();
            var fIRDocumentReference_1 = defaultFirestore
                .collectionWithPath(collectionPath)
                .addDocumentWithDataCompletion(document, function (error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve({
                        id: fIRDocumentReference_1.documentID,
                        collection: function (cp) { return firebase_common_1.firebase.firestore.collection(cp); },
                        set: function (data, options) { return firebase_common_1.firebase.firestore.set(collectionPath, fIRDocumentReference_1.documentID, data, options); },
                        get: function () { return firebase_common_1.firebase.firestore.getDocument(collectionPath, fIRDocumentReference_1.documentID); },
                        update: function (data) { return firebase_common_1.firebase.firestore.update(collectionPath, fIRDocumentReference_1.documentID, data); },
                        delete: function () { return firebase_common_1.firebase.firestore.delete(collectionPath, fIRDocumentReference_1.documentID); },
                        onSnapshot: function (callback) { return firebase_common_1.firebase.firestore.onDocumentSnapshot(fIRDocumentReference_1, callback); }
                    });
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.firestore.add: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.firestore.set = function (collectionPath, documentPath, document, options) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRFirestore) === "undefined") {
                reject("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
                return;
            }
            var docRef = FIRFirestore.firestore()
                .collectionWithPath(collectionPath)
                .documentWithPath(documentPath);
            if (options && options.merge) {
                docRef.setDataOptionsCompletion(document, FIRSetOptions.merge(), function (error) {
                    if (error) {
                        reject(error.localizedDescription);
                    }
                    else {
                        resolve();
                    }
                });
            }
            else {
                docRef.setDataCompletion(document, function (error) {
                    if (error) {
                        reject(error.localizedDescription);
                    }
                    else {
                        resolve();
                    }
                });
            }
        }
        catch (ex) {
            console.log("Error in firebase.firestore.set: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.firestore.update = function (collectionPath, documentPath, document) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRFirestore) === "undefined") {
                reject("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
                return;
            }
            var docRef = FIRFirestore.firestore()
                .collectionWithPath(collectionPath)
                .documentWithPath(documentPath);
            docRef.updateDataCompletion(document, function (error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.firestore.update: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.firestore.delete = function (collectionPath, documentPath) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRFirestore) === "undefined") {
                reject("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
                return;
            }
            var docRef = FIRFirestore.firestore()
                .collectionWithPath(collectionPath)
                .documentWithPath(documentPath);
            docRef.deleteDocumentWithCompletion(function (error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.firestore.delete: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.firestore.getCollection = function (collectionPath) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRFirestore) === "undefined") {
                reject("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
                return;
            }
            var defaultFirestore = FIRFirestore.firestore();
            var fIRDocumentReference = defaultFirestore
                .collectionWithPath(collectionPath)
                .getDocumentsWithCompletion(function (snapshot, error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    var docSnapshots = [];
                    var _loop_2 = function (i, l) {
                        var document_2 = snapshot.documents.objectAtIndex(i);
                        docSnapshots.push(new firebase_common_1.DocumentSnapshot(document_2.documentID, true, function () { return firebase_common_1.firebase.toJsObject(document_2.data()); }));
                    };
                    for (var i = 0, l = snapshot.documents.count; i < l; i++) {
                        _loop_2(i, l);
                    }
                    var snap = new firebase_common_1.QuerySnapshot();
                    snap.docSnapshots = docSnapshots;
                    resolve(snap);
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.firestore.getCollection: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.firestore.get = function (collectionPath) {
    return firebase_common_1.firebase.firestore.getCollection(collectionPath);
};
firebase_common_1.firebase.firestore.getDocument = function (collectionPath, documentPath) {
    return new Promise(function (resolve, reject) {
        try {
            if (typeof (FIRFirestore) === "undefined") {
                reject("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
                return;
            }
            FIRFirestore.firestore()
                .collectionWithPath(collectionPath)
                .documentWithPath(documentPath)
                .getDocumentWithCompletion(function (snapshot, error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    var exists_1 = snapshot.exists;
                    resolve(new firebase_common_1.DocumentSnapshot(exists_1 ? snapshot.documentID : null, exists_1, function () { return exists_1 ? firebase_common_1.firebase.toJsObject(snapshot.data()) : null; }));
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.firestore.getDocument: " + ex);
            reject(ex);
        }
    });
};
firebase_common_1.firebase.firestore._getQuery = function (collectionPath, query) {
    return {
        get: function () { return new Promise(function (resolve, reject) {
            query.getDocumentsWithCompletion(function (snapshot, error) {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    console.log(">> .where, snapshot: " + snapshot);
                    var docSnapshots = [];
                    var _loop_3 = function (i, l) {
                        var document_3 = snapshot.documents.objectAtIndex(i);
                        docSnapshots.push(new firebase_common_1.DocumentSnapshot(document_3.documentID, true, function () { return firebase_common_1.firebase.toJsObject(document_3.data()); }));
                    };
                    for (var i = 0, l = snapshot.documents.count; i < l; i++) {
                        _loop_3(i, l);
                    }
                    var snap = new firebase_common_1.QuerySnapshot();
                    snap.docSnapshots = docSnapshots;
                    resolve(snap);
                }
            });
        }); },
        where: function (fp, os, v) { return firebase_common_1.firebase.firestore.where(collectionPath, fp, os, v, query); },
        orderBy: function (fp, directionStr) { return firebase_common_1.firebase.firestore.orderBy(collectionPath, fp, directionStr, query); },
        limit: function (limit) { return firebase_common_1.firebase.firestore.limit(collectionPath, limit, query); },
        onSnapshot: function (callback) { return firebase_common_1.firebase.firestore.onCollectionSnapshot(query, callback); }
    };
};
firebase_common_1.firebase.firestore.where = function (collectionPath, fieldPath, opStr, value, query) {
    try {
        if (typeof (FIRFirestore) === "undefined") {
            console.log("Make sure 'Firebase/Firestore' is in the plugin's Podfile");
            return null;
        }
        query = query || FIRFirestore.firestore().collectionWithPath(collectionPath);
        if (opStr === "<") {
            query = query.queryWhereFieldIsLessThan(fieldPath, value);
        }
        else if (opStr === "<=") {
            query = query.queryWhereFieldIsLessThanOrEqualTo(fieldPath, value);
        }
        else if (opStr === "==") {
            query = query.queryWhereFieldIsEqualTo(fieldPath, value);
        }
        else if (opStr === ">=") {
            query = query.queryWhereFieldIsGreaterThanOrEqualTo(fieldPath, value);
        }
        else if (opStr === ">") {
            query = query.queryWhereFieldIsGreaterThan(fieldPath, value);
        }
        else {
            console.log("Illegal argument for opStr: " + opStr);
            return null;
        }
        return firebase_common_1.firebase.firestore._getQuery(collectionPath, query);
    }
    catch (ex) {
        console.log("Error in firebase.firestore.where: " + ex);
        return null;
    }
};
firebase_common_1.firebase.firestore.orderBy = function (collectionPath, fieldPath, direction, query) {
    query = query.queryOrderedByFieldDescending(fieldPath, direction === "desc");
    return firebase_common_1.firebase.firestore._getQuery(collectionPath, query);
};
firebase_common_1.firebase.firestore.limit = function (collectionPath, limit, query) {
    query = query.queryLimitedTo(limit);
    return firebase_common_1.firebase.firestore._getQuery(collectionPath, query);
};
var UNUserNotificationCenterDelegateImpl = (function (_super) {
    __extends(UNUserNotificationCenterDelegateImpl, _super);
    function UNUserNotificationCenterDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UNUserNotificationCenterDelegateImpl.new = function () {
        if (UNUserNotificationCenterDelegateImpl.ObjCProtocols.length === 0 && typeof (UNUserNotificationCenterDelegate) !== "undefined") {
            UNUserNotificationCenterDelegateImpl.ObjCProtocols.push(UNUserNotificationCenterDelegate);
        }
        return _super.new.call(this);
    };
    UNUserNotificationCenterDelegateImpl.prototype.initWithCallback = function (callback) {
        this.callback = callback;
        return this;
    };
    UNUserNotificationCenterDelegateImpl.prototype.userNotificationCenterWillPresentNotificationWithCompletionHandler = function (center, notification, completionHandler) {
        this.callback(notification);
    };
    UNUserNotificationCenterDelegateImpl.ObjCProtocols = [];
    return UNUserNotificationCenterDelegateImpl;
}(NSObject));
var FIRInviteDelegateImpl = (function (_super) {
    __extends(FIRInviteDelegateImpl, _super);
    function FIRInviteDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FIRInviteDelegateImpl.new = function () {
        if (FIRInviteDelegateImpl.ObjCProtocols.length === 0 && typeof (FIRInviteDelegate) !== "undefined") {
            FIRInviteDelegateImpl.ObjCProtocols.push(FIRInviteDelegate);
        }
        return _super.new.call(this);
    };
    FIRInviteDelegateImpl.prototype.initWithCallback = function (callback) {
        this.callback = callback;
        return this;
    };
    FIRInviteDelegateImpl.prototype.inviteFinishedWithInvitationsError = function (invitationIds, error) {
        this.callback(invitationIds, error);
    };
    FIRInviteDelegateImpl.ObjCProtocols = [];
    return FIRInviteDelegateImpl;
}(NSObject));
var FIRMessagingDelegateImpl = (function (_super) {
    __extends(FIRMessagingDelegateImpl, _super);
    function FIRMessagingDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FIRMessagingDelegateImpl.new = function () {
        if (FIRMessagingDelegateImpl.ObjCProtocols.length === 0 && typeof (FIRMessagingDelegate) !== "undefined") {
            FIRMessagingDelegateImpl.ObjCProtocols.push(FIRMessagingDelegate);
        }
        return _super.new.call(this);
    };
    FIRMessagingDelegateImpl.prototype.initWithCallback = function (callback) {
        this.callback = callback;
        return this;
    };
    FIRMessagingDelegateImpl.prototype.applicationReceivedRemoteMessage = function (remoteMessage) {
        this.callback(remoteMessage.appData);
    };
    FIRMessagingDelegateImpl.prototype.messagingDidReceiveMessage = function (messaging, remoteMessage) {
        this.callback(remoteMessage.appData);
    };
    FIRMessagingDelegateImpl.prototype.messagingDidRefreshRegistrationToken = function (messaging, fcmToken) {
        console.log(">> fcmToken refreshed: " + fcmToken);
        firebase_common_1.firebase._onTokenRefreshNotification(fcmToken);
    };
    FIRMessagingDelegateImpl.ObjCProtocols = [];
    return FIRMessagingDelegateImpl;
}(NSObject));
var GADInterstitialDelegateImpl = (function (_super) {
    __extends(GADInterstitialDelegateImpl, _super);
    function GADInterstitialDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GADInterstitialDelegateImpl.new = function () {
        if (GADInterstitialDelegateImpl.ObjCProtocols.length === 0 && typeof (GADInterstitialDelegate) !== "undefined") {
            GADInterstitialDelegateImpl.ObjCProtocols.push(GADInterstitialDelegate);
        }
        return _super.new.call(this);
    };
    GADInterstitialDelegateImpl.prototype.initWithCallback = function (callback) {
        this.callback = callback;
        return this;
    };
    GADInterstitialDelegateImpl.prototype.interstitialDidReceiveAd = function (ad) {
        this.callback(ad);
    };
    GADInterstitialDelegateImpl.prototype.interstitialDidFailToReceiveAdWithError = function (ad, error) {
        this.callback(ad, error);
    };
    GADInterstitialDelegateImpl.ObjCProtocols = [];
    return GADInterstitialDelegateImpl;
}(NSObject));
var GIDSignInDelegateImpl = (function (_super) {
    __extends(GIDSignInDelegateImpl, _super);
    function GIDSignInDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GIDSignInDelegateImpl.new = function () {
        if (GIDSignInDelegateImpl.ObjCProtocols.length === 0 && typeof (GIDSignInDelegate) !== "undefined") {
            GIDSignInDelegateImpl.ObjCProtocols.push(GIDSignInDelegate);
        }
        return _super.new.call(this);
    };
    GIDSignInDelegateImpl.prototype.initWithCallback = function (callback) {
        this.callback = callback;
        return this;
    };
    GIDSignInDelegateImpl.prototype.signInDidSignInForUserWithError = function (signIn, user, error) {
        this.callback(user, error);
    };
    GIDSignInDelegateImpl.ObjCProtocols = [];
    return GIDSignInDelegateImpl;
}(NSObject));
module.exports = firebase_common_1.firebase;
