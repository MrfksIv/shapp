package com.tns.gen.com.telerik.widget.list;

public class ReorderWithHandlesBehavior_frnal_ts_helpers_l58_c38__ExtendedReorderWithHandlesBehavior extends com.telerik.widget.list.ReorderWithHandlesBehavior implements com.tns.NativeScriptHashCodeProvider {
	public ReorderWithHandlesBehavior_frnal_ts_helpers_l58_c38__ExtendedReorderWithHandlesBehavior(int param_0){
		super(param_0);
		com.tns.Runtime.initInstance(this);
	}

	public android.view.View getReorderHandleOverride(android.view.ViewGroup param_0)  {
		java.lang.Object[] args = new java.lang.Object[1];
		args[0] = param_0;
		return (android.view.View)com.tns.Runtime.callJSMethod(this, "getReorderHandleOverride", android.view.View.class, args);
	}

	public boolean equals__super(java.lang.Object other) {
		return super.equals(other);
	}

	public int hashCode__super() {
		return super.hashCode();
	}

}
