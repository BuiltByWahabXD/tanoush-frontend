import CustomizedTimeline from "../components/CustomizedTimeline";
import LandingAppBar from "../components/LandingAppBar";
import IconStepper from "../components/IconStepper";
import "../styles/landingPage.css";
import MasonryImageList from "../components/Masonry-image-list";


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

        <div className="timeline-section">
            <CustomizedTimeline />  
        </div>
    
    </div> 
  ) 
};

export default LandingPage;