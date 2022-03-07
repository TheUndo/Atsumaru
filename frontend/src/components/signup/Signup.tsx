import React, { useContext, useState } from "react";
import Button from "../button/Button";
import Grid from "../grid/Grid";
import Input from "../input/Input";
import Modal from "../modal/Modal";
import Popup from "../popup/Popup";
import emailRegex from "./emailRegex";
import classes from "./signup.module.scss";
import LinkImage from "./AtsuAndAni.svg";
import LinkButton from "../LinkButton/LinkButton";
// @ts-ignore goddammit. Rachel, get the bible
import OAuth2Login from "react-simple-oauth2-login";
import Loading from "../loading/Loading";
import { AppContext } from "../../App";
import Header from "../header/Header";
import { apiBase } from "../../hooks/useApi";

type Props = {};

const env = (import.meta as any).env;

export default function Signup(props: Props) {
  //const [username, setUsername] = useState("");
  //const [email, setEmail] = useState("");
  //const validUsername = /^[a-zA-Z0-9-_]{2,32}$/.test(username);

  const app = useContext(AppContext);
  const [user, setUser] = app.loggedIn ?? [];
  const [shown, setShown] = app.signIn ?? [];

  //const validEmail = emailRegex.test(email);

  const [showConfirmation, setShownConfirmation] = useState(false);

  const [authorizing, setAuthorizing] = useState(false);
  const [fail, setFail] = useState(false);
  const onSuccess = (response: any) => {
    setFail(false);
    setAuthorizing(false);
    if (!response?.code) return onFailure(null);
    else {
      setAuthorizing(true);
      signIn(response.code)
        .then(user => {
          if (!user?.data?.Viewer) throw "500 error, invalid server response";
          setAuthorizing(false);
          setUser?.(user.data.Viewer);
          setShown?.(false);
        })
        .catch(error => {
          console.error("[TROUBLESHOOT] Auth error", error + "");
          setAuthorizing(false);
          setUser?.(false);
          setFail(true);
        });
    }
  };
  const onFailure = (response: any) => {
    setFail(true);
    setAuthorizing(false);
  };
  return (
    <>
      <Popup title="Sign in" shown={!!shown} onClose={() => setShown?.(false)}>
        <div className={classes.signup}>
          <div>
            <Grid>
              <p style={{ textAlign: "center", fontSize: "1.3rem" }}>
                {fail
                  ? "We were unable to link your account"
                  : "Link your AniList account to Atsumaru"}
              </p>
              <div>
                <img className={classes.image} src={LinkImage} />
              </div>
              <Button
                disabled={authorizing}
                onClick={e => {
                  setAuthorizing(true);
                  setFail(false);
                  e.currentTarget
                    ?.querySelector<HTMLButtonElement>(
                      `.${classes.oAuthButton}`,
                    )
                    ?.click();
                }}
                alignCenter
                css={{
                  background: authorizing ? "" : "var(--accent)",
                  padding: "1rem",
                }}>
                {fail ? (
                  "Oops, something went wrong, try again?"
                ) : !authorizing ? (
                  "Sign in with AniList"
                ) : (
                  <>Awaiting baked muffins</>
                )}
                <OAuth2Login
                  className={classes.oAuthButton}
                  authorizationUrl={`https://anilist.co/api/v2/oauth/authorize?client_id=${env.VITE_ANILIST_CLIENT_ID}&redirect_uri=${env.VITE_ANILIST_REDIRECT_URI}&response_type=code`}
                  responseType="code"
                  clientId={env.VITE_ANILIST_CLIENT_ID}
                  redirectUri="http://localhost:3000/ouath/anilist"
                  onSuccess={onSuccess}
                  onFailure={onFailure}></OAuth2Login>
              </Button>
              {authorizing && "Waiting for authorization"}
              <p>
                <LinkButton
                  onClick={e => {
                    e.preventDefault();
                    setShown?.(false);
                    setShownConfirmation(true);
                  }}
                  variant="white"
                  href="#">
                  No thank you, I don't need progress tracking
                </LinkButton>
              </p>
            </Grid>
          </div>
        </div>
      </Popup>
      <Popup
        shown={showConfirmation}
        onClose={() => setShownConfirmation(false)}>
        <Header level={1}>Understood.</Header>
        <p>If you change your mind you can sign up at any time.</p>
        <Button onClick={() => setShownConfirmation(false)}>Got it</Button>
      </Popup>
      {/* <Modal onClose={() => void 0} shown={false}>

      </Modal> */}
    </>
  );
}

async function signIn(code: string) {
  try {
    const req = await fetch(`${apiBase}/auth/anilist`, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      redirect: "follow",
      body: JSON.stringify({
        code,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const res = await req.json();

    return res;
  } catch (e) {
    return e;
  }
}

/*

<Grid gap="1rem">
              <Input
                value={username}
                invalid={!!username.length && !validUsername}
                onChange={e => setUsername(e.target.value)}
                fullWidth
                errorMessage={
                  !!username.length &&
                  !validUsername && (
                    <>
                      Usernames must be between 2-32 characters,
                      <br />
                      and may only contain 'a-z', 'A-Z', '0-9', '_' & '-'.
                    </>
                  )
                }
                placeholder="Username"
              />
              <Input
                value={email}
                invalid={!!email.length && !validEmail}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                errorMessage={
                  !!email.length && !validEmail && "Invalid E-mail address"
                }
                placeholder="E-mail"
              />
              <Grid gap="1rem">
                <Button
                  disabled={!validEmail || !validUsername}
                  fullWidth
                  alignCenter
                  css={{ background: "var(--accent)" }}>
                  Create Account
                </Button>
                <a href="javascript:void" onClick={() => void 0}>
                  Login instead
                </a>
              </Grid>
            </Grid>


*/
