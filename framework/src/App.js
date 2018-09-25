
require('../styles/main.css');
require('../fonts/fonts.css');
const NotificationForm = require('./NotificationForm');
const NotificationHub = require('./NotificationHub');

module.exports = class App {
  constructor(routes, notifications) {
    this.navigate = this.navigate.bind(this);
    this.navigateToLocation = this.navigateToLocation.bind(this);
    this.render = this.render.bind(this);
    this.setupEventListeners = this.setupEventListeners.bind(this);

    this.routes = routes;
    this.notificationForm = new NotificationForm(notifications, this.render);

    this.watchFace = document.getElementById("watch-face");
    this.leftButton = document.getElementById("button-left");
    this.rightButton = document.getElementById("button-right");
    this.topButton = document.getElementById("button-top");
    this.bottomButton = document.getElementById("button-bottom");
    this.notificationContainer = document.getElementById("notification-container");
    this.wholePage = document.body;

    const hideNotification = () => {
      this.navigateToLocation(window.location, this.props);
    }

    window.onhashchange = (hashChangeEvent) => { 
      const pageName = hashChangeEvent.newURL.split("#")[1];
      this.navigate(pageName);
    }

    NotificationHub.onHide(hideNotification);
  }

  navigateToLocation(location, props = {}) {
    let path = location.hash.slice(1);
    if (path === "") {
      path = "/";
    }
    this.navigate(path, props);
  }

  setupEventListeners(view) {
    this.leftButton.removeEventListener("click", this.leftListener);
    this.rightButton.removeEventListener("click", this.rightListener);
    this.topButton.removeEventListener("click", this.topListener);
    this.bottomButton.removeEventListener("click", this.bottomListener);
    this.watchFace.removeEventListener("click", this.faceListener);
    this.notificationContainer.removeEventListener("click", this.faceListener);
    this.wholePage.removeEventListener("keyup",this.keyEventListener);

    this.leftListener = view.leftButtonEvent.bind(view);
    this.rightListener = view.rightButtonEvent.bind(view);
    this.topListener = view.topButtonEvent.bind(view);
    this.bottomListener = view.bottomButtonEvent.bind(view);
    this.faceListener = view.faceButtonEvent.bind(view);
    this.keyEventListener = view.keyEvent.bind(view);

    this.leftButton.addEventListener("click", this.leftListener);
    this.rightButton.addEventListener("click", this.rightListener);
    this.topButton.addEventListener("click", this.topListener);
    this.bottomButton.addEventListener("click", this.bottomListener);
    this.watchFace.addEventListener("click", this.faceListener);
    this.notificationContainer.addEventListener("click", this.faceListener);
    this.wholePage.addEventListener("keyup",this.keyEventListener);
  }

  navigate(path, props = {}) {
    this.props = props;
    const Page = this.routes[path] || this.routes["404"];
    this.render(this.watchFace, Page, props);
    window.location.hash = path;
  }

  render(element, ViewType, props) {

    const view = new ViewType({
      ...props,
      navigate: this.navigate,
      watchFace: this.watchFace,
    })

    this.setupEventListeners(view);
    view.pageWillLoad();
    element.innerHTML = view.render();
    view.pageDidLoad();
  }
};
