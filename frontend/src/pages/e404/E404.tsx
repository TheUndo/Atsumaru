import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import Layout from "../../components/layout/Layout";

type Props = {
  children?: React.ReactNode | React.ReactNode[];
};

export default function E404(props: Props) {
  return (
    <>
      <Header level={1}>Page not found</Header>
      <p>
        Error 404, resource not found. <Link to="/">Home page</Link>.
      </p>
    </>
  );
}
