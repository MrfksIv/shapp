package com.tns.gen.com.telerik.widget.list;

public class SwipeRefreshBehavior_SwipeRefreshListener implements com.telerik.widget.list.SwipeRefreshBehavior.SwipeRefreshListener {
	public SwipeRefreshBehavior_SwipeRefreshListener() {
		com.tns.Runtime.initInstance(this);
	}

	public void onRefreshRequested()  {
		java.lang.Object[] args = null;
		com.tns.Runtime.callJSMethod(this, "onRefreshRequested", void.class, args);
	}

}
