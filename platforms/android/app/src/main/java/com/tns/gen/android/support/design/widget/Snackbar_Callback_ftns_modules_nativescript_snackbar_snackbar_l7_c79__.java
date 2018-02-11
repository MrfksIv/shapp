package com.tns.gen.android.support.design.widget;

public class Snackbar_Callback_ftns_modules_nativescript_snackbar_snackbar_l7_c79__ extends android.support.design.widget.Snackbar.Callback implements com.tns.NativeScriptHashCodeProvider {
	public Snackbar_Callback_ftns_modules_nativescript_snackbar_snackbar_l7_c79__(){
		super();
		com.tns.Runtime.initInstance(this);
	}

	public void onDismissed(android.support.design.widget.Snackbar param_0, int param_1)  {
		java.lang.Object[] args = new java.lang.Object[2];
		args[0] = param_0;
		args[1] = param_1;
		com.tns.Runtime.callJSMethod(this, "onDismissed", void.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
