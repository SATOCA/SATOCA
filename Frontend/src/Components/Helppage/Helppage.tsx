import React from "react";
import { Container, Row } from "reactstrap";
import "./Helppage.css";

export default function Helppage() {
  return (
    <>
      <br />
      <Container>
        <Row>
          <h2>About Differential privacy</h2>
        </Row>
        <Row>
          <p>
            <b>Differential privacy</b> (<b>DP</b>) is a system for publicly
            sharing information about a dataset by describing the patterns of
            groups within the dataset while withholding information about
            individuals in the dataset. The idea behind differential privacy is
            that if the effect of making an arbitrary single substitution in the
            database is small enough, the query result cannot be used to infer
            much about any single individual, and therefore provides privacy.
            Another way to describe differential privacy is as a constraint on
            the algorithms used to publish aggregate information about a{" "}
            <a
              href="https://en.wikipedia.org/wiki/Statistical_database"
              title="Statistical database"
            >
              statistical database
            </a>{" "}
            which limits the disclosure of private information of records whose
            information is in the database. For example, differentially private
            algorithms are used by some government agencies to publish
            demographic information or other statistical aggregates while
            ensuring{" "}
            <a
              href="https://en.wikipedia.org/wiki/Confidentiality"
              title="Confidentiality"
            >
              confidentiality
            </a>{" "}
            of survey responses, and{" "}
            <a href="https://en.wikipedia.org/wiki/Differential_privacy#Adoption_of_differential_privacy_in_real-world_applications">
              by companies
            </a>{" "}
            to collect information about user behavior while controlling what is
            visible even to internal analysts.
          </p>
          <p>
            Roughly, an algorithm is differentially private if an observer
            seeing its output cannot tell if a particular individual's
            information was used in the computation. Differential privacy is
            often discussed in the context of identifying individuals whose
            information may be in a database. Although it does not directly
            refer to identification and{" "}
            <a
              href="https://en.wikipedia.org/wiki/Data_re-identification"
              title="Data re-identification"
            >
              reidentification
            </a>{" "}
            attacks, differentially private algorithms probably resist such
            attacks.
          </p>
          <p>
            Differential privacy was developed by{" "}
            <a
              href="https://en.wikipedia.org/wiki/Cryptography"
              title="Cryptography"
            >
              cryptographers
            </a>{" "}
            and thus is often associated with cryptography, and draws much of
            its language from cryptography.
          </p>
        </Row>
      </Container>
    </>
  );
}
