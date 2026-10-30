export const metadata = { title: "Privacy Policy — agni" };

export default function PrivacyPage() {
  return (
    <div className="container-x py-14">
      <article className="prose mx-auto">
        <h1>Privacy Policy</h1>
        <p>
          This policy explains what data agni (agni.cc.cd) collects, why, and what you can do
          about it.
        </p>
        <h2>What we collect</h2>
        <p>
          When a short link is clicked, we record the request details the edge can see: IP
          address, country, city, referrer, user agent (browser, operating system, device),
          language, protocol and TLS version, and the exact timestamp.
        </p>
        <p>
          When you create an account we store your provider identity (uid, email, display name
          and avatar as provided by your sign-in provider) and the links you create.
        </p>
        <h2>Why</h2>
        <p>
          Analytics data powers the dashboard that makes agni useful: it tells link owners where
          their clicks come from. Account data keeps your links attached to you.
        </p>
        <h2>Who can see it</h2>
        <p>
          Click analytics for a link is visible only to the account that created that link (and
          to service operators for abuse handling). We do not sell data to third parties.
        </p>
        <h2>Retention</h2>
        <p>
          Analytics events are retained to provide trend data. Deleting a link deletes its
          analytics history with it. Contact us if you want your account and data removed.
        </p>
        <h2>Cookies</h2>
        <p>
          agni does not use advertising or tracking cookies. Your theme preference and session
          are stored locally in your browser and with our auth provider.
        </p>
        <h2>Infrastructure</h2>
        <p>
          The service runs on Cloudflare. Request data transits and is processed by Cloudflare's
          network as our processor, per their privacy policy.
        </p>
      </article>
    </div>
  );
}
