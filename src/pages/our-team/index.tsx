import SEO from "~/components/SEO/index";
import OurTeam from "~/components/TeamPage/OurTeam";

function OurTeamPage() {
  return (
    <>
      <SEO 
        title="Our Team | Capture Incridea"
        description="Meet the talented team behind Capture Incridea - the photographers, developers, and creatives who make it all possible."
        url="https://capture.incridea.in/our-team"
      />
      <div className="gradient-bg">
        <OurTeam />
      </div>
    </>
  );
}

export default OurTeamPage;
