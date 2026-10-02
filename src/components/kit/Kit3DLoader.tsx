"use client";
import dynamic from "next/dynamic";

const Kit3D = dynamic(() => import("./Kit3D"), { ssr: false, loading: () => <div className="kit3d"><div className="kit3d-stage" /><p className="muted">Loading the 3D model</p></div> });
export function Kit3DLoader() { return <Kit3D />; }
