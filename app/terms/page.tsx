export const metadata = { title: "Terms of Service — agni" };

export default function TermsPage() {
  return (
    <div className="container-x py-14">
      <article className="prose mx-auto">
        <h1>Terms of Service</h1>
        <p>
          These terms govern your use of agni (agni.cc.cd). By using the service you agree to
          them. If you do not agree, please do not use the service.
        </p>
        <h2>The service</h2>
        <p>
          agni provides link shortening, redirect delivery and click analytics. The service is
          provided free of charge today. We may introduce paid plans later; the free plan will
          continue to exist.
        </p>
        <h2>Acceptable use</h2>
        <p>You agree not to use agni to:</p>
        <ul>
          <li>Distribute malware, phishing pages, or illegal content</li>
          <li>Impersonate another person or organization</li>
          <li>Abuse, disrupt, or attempt to gain unauthorized access to the service</li>
          <li>Resell the service without permission</li>
        </ul>
        <p>
          We may suspend or remove links that violate these terms or that generate abuse
          reports.
        </p>
        <h2>Your content</h2>
        <p>
          Links you create remain yours. You grant us the limited right to store and redirect
          them and to collect analytics on the clicks they receive.
        </p>
        <h2>Disclaimer</h2>
        <p>
          The service is provided "as is" without warranties of any kind. We are not liable for
          damages arising from use of the service. Redirect targets are controlled by their
          owners; we are not responsible for their content.
        </p>
        <h2>Changes</h2>
        <p>
          We may update these terms. Material changes will be announced on this page. Continued
          use after changes means acceptance.
        </p>
        <h2>Contact</h2>
        <p>Questions? Open an issue on our GitHub repository or reach out through the site.</p>
      </article>
    </div>
  );
}
