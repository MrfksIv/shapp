"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// this import should be first in order to load some required settings (like globals and reflect-metadata)
var platform_1 = require("nativescript-angular/platform");
var app_module_1 = require("./app.module");
var tnsOAuthModule = require("nativescript-oauth");
var firebase = require("nativescript-plugin-firebase");
var facebookInitOptions = {
    clientId: '171980550097374',
    clientSecret: '37bf7d8551c00db26b052df1926913b5',
    scope: ['email', 'user_friends'] //whatever other scopes you need 
};
firebase.init({ iOSEmulatorFlush: true })
    .then(function (instance) {
    console.log("firebase.init done");
}, function (error) {
    console.log("firebase.init error: " + error);
});
tnsOAuthModule.initFacebook(facebookInitOptions);
// A traditional NativeScript application starts by initializing global objects, setting up global CSS rules, creating, and navigating to the main page. 
// Angular applications need to take care of their own initialization: modules, components, directives, routes, DI providers. 
// A NativeScript Angular app needs to make both paradigms work together, so we provide a wrapper platform object, platformNativeScriptDynamic, 
// that sets up a NativeScript application and can bootstrap the Angular framework.
platform_1.platformNativeScriptDynamic().bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwR0FBMEc7QUFDMUcsMERBQTRFO0FBRTVFLDJDQUF5QztBQUN6QyxtREFBcUQ7QUFDckQsdURBQXlEO0FBRXpELElBQUksbUJBQW1CLEdBQTZDO0lBQ2hFLFFBQVEsRUFBRSxpQkFBaUI7SUFDM0IsWUFBWSxFQUFFLGtDQUFrQztJQUNoRCxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUMsaUNBQWlDO0NBQ3JFLENBQUM7QUFHRixRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFDLENBQUM7S0FDdEMsSUFBSSxDQUNGLFVBQUEsUUFBUTtJQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN0QyxDQUFDLEVBQ0QsVUFBQSxLQUFLO0lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBd0IsS0FBTyxDQUFDLENBQUM7QUFDakQsQ0FBQyxDQUNILENBQUM7QUFFRixjQUFjLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFakQseUpBQXlKO0FBQ3pKLDhIQUE4SDtBQUM5SCxnSkFBZ0o7QUFDaEosbUZBQW1GO0FBQ25GLHNDQUEyQixFQUFFLENBQUMsZUFBZSxDQUFDLHNCQUFTLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRoaXMgaW1wb3J0IHNob3VsZCBiZSBmaXJzdCBpbiBvcmRlciB0byBsb2FkIHNvbWUgcmVxdWlyZWQgc2V0dGluZ3MgKGxpa2UgZ2xvYmFscyBhbmQgcmVmbGVjdC1tZXRhZGF0YSlcbmltcG9ydCB7IHBsYXRmb3JtTmF0aXZlU2NyaXB0RHluYW1pYyB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9wbGF0Zm9ybVwiO1xuXG5pbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tIFwiLi9hcHAubW9kdWxlXCI7XG5pbXBvcnQgKiBhcyB0bnNPQXV0aE1vZHVsZSBmcm9tICduYXRpdmVzY3JpcHQtb2F1dGgnO1xuaW1wb3J0ICogYXMgZmlyZWJhc2UgZnJvbSAnbmF0aXZlc2NyaXB0LXBsdWdpbi1maXJlYmFzZSc7XG5cbnZhciBmYWNlYm9va0luaXRPcHRpb25zIDogdG5zT0F1dGhNb2R1bGUuSVRuc09BdXRoT3B0aW9uc0ZhY2Vib29rID0ge1xuICAgIGNsaWVudElkOiAnMTcxOTgwNTUwMDk3Mzc0JyxcbiAgICBjbGllbnRTZWNyZXQ6ICczN2JmN2Q4NTUxYzAwZGIyNmIwNTJkZjE5MjY5MTNiNScsXG4gICAgc2NvcGU6IFsnZW1haWwnLCAndXNlcl9mcmllbmRzJ10gLy93aGF0ZXZlciBvdGhlciBzY29wZXMgeW91IG5lZWQgXG59O1xuXG5cbmZpcmViYXNlLmluaXQoe2lPU0VtdWxhdG9yRmx1c2g6IHRydWV9KVxuLnRoZW4oXG4gICBpbnN0YW5jZSA9PiB7XG4gICAgICAgY29uc29sZS5sb2coXCJmaXJlYmFzZS5pbml0IGRvbmVcIik7XG4gICB9LFxuICAgZXJyb3IgPT4ge1xuICAgICAgIGNvbnNvbGUubG9nKGBmaXJlYmFzZS5pbml0IGVycm9yOiAke2Vycm9yfWApO1xuICAgfVxuKTtcblxudG5zT0F1dGhNb2R1bGUuaW5pdEZhY2Vib29rKGZhY2Vib29rSW5pdE9wdGlvbnMpO1xuXG4vLyBBIHRyYWRpdGlvbmFsIE5hdGl2ZVNjcmlwdCBhcHBsaWNhdGlvbiBzdGFydHMgYnkgaW5pdGlhbGl6aW5nIGdsb2JhbCBvYmplY3RzLCBzZXR0aW5nIHVwIGdsb2JhbCBDU1MgcnVsZXMsIGNyZWF0aW5nLCBhbmQgbmF2aWdhdGluZyB0byB0aGUgbWFpbiBwYWdlLiBcbi8vIEFuZ3VsYXIgYXBwbGljYXRpb25zIG5lZWQgdG8gdGFrZSBjYXJlIG9mIHRoZWlyIG93biBpbml0aWFsaXphdGlvbjogbW9kdWxlcywgY29tcG9uZW50cywgZGlyZWN0aXZlcywgcm91dGVzLCBESSBwcm92aWRlcnMuIFxuLy8gQSBOYXRpdmVTY3JpcHQgQW5ndWxhciBhcHAgbmVlZHMgdG8gbWFrZSBib3RoIHBhcmFkaWdtcyB3b3JrIHRvZ2V0aGVyLCBzbyB3ZSBwcm92aWRlIGEgd3JhcHBlciBwbGF0Zm9ybSBvYmplY3QsIHBsYXRmb3JtTmF0aXZlU2NyaXB0RHluYW1pYywgXG4vLyB0aGF0IHNldHMgdXAgYSBOYXRpdmVTY3JpcHQgYXBwbGljYXRpb24gYW5kIGNhbiBib290c3RyYXAgdGhlIEFuZ3VsYXIgZnJhbWV3b3JrLlxucGxhdGZvcm1OYXRpdmVTY3JpcHREeW5hbWljKCkuYm9vdHN0cmFwTW9kdWxlKEFwcE1vZHVsZSk7XG4iXX0=