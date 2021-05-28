const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const analyzeReview = (reviews)=>{
    let goodComments=[];
    let badComments=[];

    reviews.forEach(com => {
      let resp = sentiment.analyze(com.text);
      if(resp.score < 1){
          badComments.push(com);
          return;
      }
      goodComments.push(com);
    });

    const goodPercent = ((goodComments.length /  reviews.length) *100).toFixed(2);
    const badPercent= ((badComments.length /  reviews.length) *100).toFixed(2);

     return{
         goodComments,
         badComments,
         goodPercent,
         badPercent
     }

}

module.exports = analyzeReview;