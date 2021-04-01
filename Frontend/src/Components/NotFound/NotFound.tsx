import React from "react";
import "./NotFound.css";
import slice from "./slice.svg";
import { Container } from "reactstrap";

export default function NotFound() {
  return (
    <Container className="glass-card-content centered" fluid="lg">
      <h1>404 - Survey could not be found</h1>
      {"          "}
      <div className="spinner">
        <img src={slice} alt="slice 1" className="pizza-part pizza-part-1" />
        <img src={slice} alt="slice 2" className="pizza-part pizza-part-2" />
        <img src={slice} alt="slice 3" className="pizza-part pizza-part-3" />
        <img src={slice} alt="slice 4" className="pizza-part pizza-part-4" />
      </div>
    </Container>
  );
}
