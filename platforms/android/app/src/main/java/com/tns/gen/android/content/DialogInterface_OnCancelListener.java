package com.tns.gen.android.content;

public class DialogInterface_OnCancelListener implements android.content.DialogInterface.OnCancelListener {
	public DialogInterface_OnCancelListener() {
		com.tns.Runtime.initInstance(this);
	}

	public void onCancel(android.content.DialogInterface param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onCancel", void.class, args);
	}

}
