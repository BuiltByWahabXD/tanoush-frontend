import CustomizedTimeline from "../components/CustomizedTimeline";
import LandingAppBar from "../components/LandingAppBar";
import IconStepper from "../components/IconStepper";
import Lightning from "../components/Lightning";
import "../styles/landingPage.css";
import MasonryImageList from "../components/Masonry-image-list";
import ParallaxMarquee from "../components/ParallaxMarquee";


const LandingPage = () => {
  return(
    <div className="landing-Page">  
        <LandingAppBar />

        <div className="hero-image">
            <img 
                src="/static/images/hero-image.jpg" 
                alt="Landing Page Image" 
            />

        </div>
        <div className="stepper-section">
            <IconStepper />
        </div>
        <div>
        </div>

        <div className="image-list-section">
            <MasonryImageList />
            <br/>
        </div>

        <div className="thor-image-section">
            <img 
                src="/static/images/imagelist/Thor.png" 
                alt="Thor Image" 
            />
        </div>

        <div className="lightning-section">
            <Lightning
              hue={221}
              xOffset={0}
              speed={1}
              intensity={1.8}
              size={1}
            />
            <div className="thor-text">
              <h1>THE GOD OF THUNDER</h1>
              <h2>THOR</h2>
              <p>Wielder of Mjolnir, Protector of the Nine Realms</p>
            </div>
        </div>    

        <div>
            <ParallaxMarquee baseVelocity={-1.5} className="first-marquee">
                DISCOVER • CHOOSE • EVOLVE •
            </ParallaxMarquee>
            <ParallaxMarquee baseVelocity={1.5} className="second-marquee">
                EXPLORE • EXPERIENCE • REMEMBER •
            </ParallaxMarquee>
            
        </div>

        <div className="timeline-section">
            <CustomizedTimeline />  
        </div>    
        
    </div> 
  ) 
};

export default LandingPage;