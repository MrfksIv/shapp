package com.tns.gen.com.google.firebase.auth;

public class PhoneAuthProvider_OnVerificationStateChangedCallbacks_ftns_modules_nativescript_plugin_firebase_firebase_l925_c138__ extends com.google.firebase.auth.PhoneAuthProvider.OnVerificationStateChangedCallbacks implements com.tns.NativeScriptHashCodeProvider {
	public PhoneAuthProvider_OnVerificationStateChangedCallbacks_ftns_modules_nativescript_plugin_firebase_firebase_l925_c138__(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public void onVerificationCompleted(com.google.firebase.auth.PhoneAuthCredential param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onVerificationCompleted", void.class, args);
	}

	public void onVerificationFailed(com.google.firebase.FirebaseException param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onVerificationFailed", void.class, args);
	}

	public void onCodeSent(java.lang.String param_0, com.google.firebase.auth.PhoneAuthProvider.ForceResendingToken param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		com.tns.Runtime.callJSMethod(this, "onCodeSent", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
