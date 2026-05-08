import "../_deck/styles/theme.css";
import "../_deck/styles/glass.css";
import "./login.css";
import { login } from "../content";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function pickString(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

const DEFAULT_LANDING = "/#s/hero";

function safeNext(next: string | undefined): string {
  if (!next) return DEFAULT_LANDING;
  if (!next.startsWith("/") || next.startsWith("//")) return DEFAULT_LANDING;
  return next;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const next = safeNext(pickString(params.next));
  const errored = pickString(params.err) === "1";

  return (
    <div className="wipu-root wpd-login-page" data-theme="dark">
      <div className="wpd-login-card glass">
        <div>
          <div className="wpd-login-eyebrow">{login.eyebrow}</div>
          <h1 className="wpd-login-title">{login.title}</h1>
        </div>
        <form
          className="wpd-login-form"
          method="POST"
          action="/api/auth/login"
          autoComplete="off"
        >
          <input type="hidden" name="next" value={next} />
          <input
            className="wpd-login-input"
            name="password"
            type="password"
            placeholder={login.passwordPlaceholder}
            autoFocus
            required
          />
          <button className="wpd-login-submit" type="submit">
            {login.submit}
          </button>
          {errored && (
            <p className="wpd-login-error" role="alert">
              {login.error}
            </p>
          )}
        </form>
        <p className="wpd-login-foot">
          {login.foot}
        </p>
      </div>
    </div>
  );
}
