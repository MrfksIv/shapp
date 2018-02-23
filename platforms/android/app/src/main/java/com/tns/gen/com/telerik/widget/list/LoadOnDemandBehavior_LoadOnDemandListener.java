package com.tns.gen.com.telerik.widget.list;

public class LoadOnDemandBehavior_LoadOnDemandListener implements com.telerik.widget.list.LoadOnDemandBehavior.LoadOnDemandListener {
	public LoadOnDemandBehavior_LoadOnDemandListener() {
		com.tns.Runtime.initInstance(this);
	}

	public void onLoadStarted()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "onLoadStarted", void.class, args);
	}

	public void onLoadFinished()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "onLoadFinished", void.class, args);
	}

}
