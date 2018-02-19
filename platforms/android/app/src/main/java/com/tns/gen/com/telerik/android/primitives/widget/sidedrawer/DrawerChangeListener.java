package com.tns.gen.com.telerik.android.primitives.widget.sidedrawer;

public class DrawerChangeListener implements com.telerik.android.primitives.widget.sidedrawer.DrawerChangeListener {
	public DrawerChangeListener() {
		com.tns.Runtime.initInstance(this);
	}

	public boolean onDrawerOpening(com.telerik.android.primitives.widget.sidedrawer.RadSideDrawer param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		return (boolean)com.tns.Runtime.callJSMethod(this, "onDrawerOpening", boolean.class, args);
	}

	public void onDrawerOpened(com.telerik.android.primitives.widget.sidedrawer.RadSideDrawer param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onDrawerOpened", void.class, args);
	}

	public boolean onDrawerClosing(com.telerik.android.primitives.widget.sidedrawer.RadSideDrawer param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		return (boolean)com.tns.Runtime.callJSMethod(this, "onDrawerClosing", boolean.class, args);
	}

	public void onDrawerClosed(com.telerik.android.primitives.widget.sidedrawer.RadSideDrawer param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onDrawerClosed", void.class, args);
	}

	public void onDrawerPan(com.telerik.android.primitives.widget.sidedrawer.RadSideDrawer param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		com.tns.Runtime.callJSMethod(this, "onDrawerPan", void.class, args);
	}

}
