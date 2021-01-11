const stopPropagation = (event, cb = () => {}) => {
  if (event?.domEvent) {
    event?.domEvent.stopPropagation();
  } else {
    event?.stopPropagation();
  }

  cb();
};

export default stopPropagation;
