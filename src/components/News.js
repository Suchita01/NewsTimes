import React, {useEffect, useState} from 'react'
import Newsitem from './Newsitem'
import Loader from './Loader';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
   const [articles, setArticles] = useState([])
   const [loading, setLoading] = useState(true)
   const [page, setPage] = useState(1)
   const [totalResults, setTotalResults] = useState(0)
  


   const capitalizeFirstLetter = (string)=>{
    return string.charAt(0).toUpperCase() + string.slice(1);
   }

    const updateNews = async () =>{
      props.setProgress(10);
      console.log(page);
      setLoading(true)
      const url =`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=183428dd28414476b662189e43705eac&page=${page}&pageSize=
      ${props.pageSize}`;
      let data = await fetch(url);
      props.setProgress(30);
      let parsedData = await data.json()
      props.setProgress(70);
      setArticles(parsedData.articles)
      setTotalResults(parsedData.totalResults)
      setLoading(false)
      props.setProgress(100);
    }

    useEffect(() => {
      document.title = `${capitalizeFirstLetter(props.category)} - NewsTimes`;
      updateNews();
      //eslint-disable-next-line
    }, [])

      const fetchMoreData = async() => {
      console.log(page);
      const url =`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=183428dd28414476b662189e43705eac&page=${page+1}&pageSize=
      ${props.pageSize}`;
      setPage(page + 1);
      let data = await fetch(url);
      let parsedData = await data.json()
      setArticles(articles.concat(parsedData.articles))
      setTotalResults(parsedData.totalResults)
    };

    return (
      <>
        <h2 className="text-center" style={{margin:'35px 0px' , marginTop:'90px'}}> Top {capitalizeFirstLetter(props.category)} Headlines</h2>
        {loading && <Loader/>}
        <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={loading && <Loader/>}>
        
         <div className="container">
          <div className="row">
            {articles.map((element) => {
                return<div className="col-md-3" key={element.url}>
                <Newsitem title={element.title?element.title.slice(0, 55):""} 
                description={element.description?element.description.slice(0, 100):""} imageUrl={element.urlToImage} 
                newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                </div>
            })}
            </div>
            </div>
            </InfiniteScroll>

            {/* <div className="container d-flex justify-content-between">
            <button disabled={page<=1}type="button" className="btn btn-dark" onClick={handlePrevClick}>&larr; Previous</button>
            <button disabled={page + 1 > Math.ceil(totalResults/props.pageSize)} type="button" className="btn btn-dark" onClick={handleNextClick}>Next &rarr;</button>

            </div> */}
       </>
    )
  
}

News.defaultProps={
  country:'in',
  pageSize:8,
  category:'general',
}

News.propTypes={
  country:PropTypes.string,
  pageSize:PropTypes.number,
  category:PropTypes.string,
}


export default News
