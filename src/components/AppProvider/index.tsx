"use client";

// clientでないと使用できないProviderを適応
import React from "react";
import { RecoilRoot } from "recoil";
type Props = { children: React.ReactNode };

const AppProvider: React.FC<Props> = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};
export default AppProvider;
