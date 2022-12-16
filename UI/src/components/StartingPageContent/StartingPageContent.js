import classes from './StartingPageContent.module.css';
import imagesImage from '../component/image/Top_10_Crypto_Predictions_to_Watch_Out_For_in_2023.avif';

const StartingPageContent = () => {
  return (
   
    <section className={classes.starting}>
     
      <div className={classes['starting-image']}>
    
        <img src={imagesImage} alt='A table full of delicious food!' />
      </div>
    </section>
   
  );
};

export default StartingPageContent;
