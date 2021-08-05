import clsx from "clsx";
import React, { createRef } from "react";
import ReactDOM from "react-dom";

import ImageGallery from "../src/ImageGallery";

const PREFIX_URL = "https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      showGalleryFullscreenButton: false,
      showGalleryPlayButton: false,
      slideDuration: 450,
      slideInterval: 2000,
      slideOnThumbnailOver: false,
      thumbnailPosition: "bottom",
      showVideo: {},
      isFullScreen: false,
    };

    this.images = [
      {
        original: `${PREFIX_URL}image_set_default.jpg`,
        thumbnail: `${PREFIX_URL}image_set_thumb.jpg`,
        imageSet: [
          {
            srcSet: `${PREFIX_URL}image_set_cropped.jpg`,
            media: "(max-width: 1280px)",
          },
          {
            srcSet: `${PREFIX_URL}image_set_default.jpg`,
            media: "(min-width: 1280px)",
          },
        ],
      },
      {
        original: `${PREFIX_URL}1.jpg`,
        thumbnail: `${PREFIX_URL}1t.jpg`,
        originalClass: "featured-slide",
        thumbnailClass: "featured-thumb",
        description: "Custom class for slides & thumbnails",
      },
    ].concat(this._getStaticImages());
  }

  componentDidMount() {
    document.addEventListener("click", this._handleElementCheck.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.slideInterval !== prevState.slideInterval || this.state.slideDuration !== prevState.slideDuration) {
      // refresh setInterval
      this._imageGallery.pause();
      this._imageGallery.play();
    }
  }

  _handleElementCheck(event) {
    // event.preventDefault();
    if (event.target.classList[0] !== "image-gallery-image") {
      this.setState({
        menuContentShow: false,
        x: 0,
        y: 0,
      });
    }
  }

  _onImageClick(event) {
    console.debug("ImageClick");
  }

  _onImageLoad(event) {
    console.debug("loaded image", event.target.src);
  }

  _onSlide(index) {
    this._resetVideo();
    console.debug("slid to index", index);
  }

  _onPause(index) {
    console.debug("paused on index", index);
  }

  _onScreenChange(fullScreenElement) {
    console.log("isFullScreen?", !!fullScreenElement);
    this.setState({
      isFullScreen: !!fullScreenElement,
    });
  }

  _onPlay(index) {
    console.debug("playing from index", index);
  }

  _getStaticImages() {
    const images = [];
    for (let i = 2; i < 12; i++) {
      images.push({
        original: `${PREFIX_URL}${i}.jpg`,
        thumbnail: `${PREFIX_URL}${i}t.jpg`,
      });
    }

    return images;
  }

  _resetVideo() {
    this.setState({ showVideo: {} });

    if (this.state.showPlayButton) {
      this.setState({ showGalleryPlayButton: true });
    }

    if (this.state.showFullscreenButton) {
      this.setState({ showGalleryFullscreenButton: true });
    }
  }

  _toggleShowVideo(url) {
    this.state.showVideo[url] = !this.state.showVideo[url];
    this.setState({
      showVideo: this.state.showVideo,
    });

    if (this.state.showVideo[url]) {
      if (this.state.showPlayButton) {
        this.setState({ showGalleryPlayButton: false });
      }

      if (this.state.showFullscreenButton) {
        this.setState({ showGalleryFullscreenButton: false });
      }
    }
  }

  _renderVideo(item) {
    return (
      <div>
        {this.state.showVideo[item.embedUrl] ? (
          <div className="video-wrapper">
            <a className="close-video" onClick={this._toggleShowVideo.bind(this, item.embedUrl)} />
            <iframe width="560" height="315" src={item.embedUrl} frameBorder="0" allowFullScreen />
          </div>
        ) : (
          <a onClick={this._toggleShowVideo.bind(this, item.embedUrl)}>
            <div className="play-button" />
            <img className="image-gallery-image" src={item.original} />
            {item.description && (
              <span className="image-gallery-description" style={{ right: "0", left: "initial" }}>
                {item.description}
              </span>
            )}
          </a>
        )}
      </div>
    );
  }

  render() {
    return (
      <section className="app">
        <ImageGallery
          ref={(i) => (this._imageGallery = i)}
          items={this.images}
          lazyLoad={false}
          onClick={this._onImageClick.bind(this)}
          onImageLoad={this._onImageLoad}
          onSlide={this._onSlide.bind(this)}
          onPause={this._onPause.bind(this)}
          onScreenChange={this._onScreenChange.bind(this)}
          onPlay={this._onPlay.bind(this)}
          showFullscreenButton={this.state.showFullscreenButton && this.state.showGalleryFullscreenButton}
          showPlayButton={this.state.showPlayButton && this.state.showGalleryPlayButton}
          additionalClass="app-image-gallery"
        />
      </section>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("container"));
