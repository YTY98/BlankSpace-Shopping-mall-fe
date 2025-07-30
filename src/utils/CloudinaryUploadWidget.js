import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "../App.css";
import "../common/style/common.style.css";

const CLOUDNAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOADPRESET = process.env.REACT_APP_CLOUDINARY_PRESET;

class CloudinaryUploadWidget extends Component {
  componentDidMount() {
    var myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDNAME,
        uploadPreset: UPLOADPRESET,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          
          // DOM 요소를 안전하게 처리
          const uploadedImageElement = document.getElementById("uploadedimage");
          if (uploadedImageElement) {
            uploadedImageElement.setAttribute("src", result.info.secure_url);
          }
          
          // 부모 컴포넌트에 이미지 URL 전달
          this.props.uploadImage(result.info.secure_url);
        }
      } //https://cloudinary.com/documentation/react_image_and_video_upload
    );
    
    // 위젯 버튼을 안전하게 처리
    const uploadWidgetButton = document.getElementById("upload_widget");
    if (uploadWidgetButton) {
      uploadWidgetButton.addEventListener(
        "click",
        function () {
          myWidget.open();
        },
        false
      );
    }
  }

  render() {
    return (
      <Button id="upload_widget" size="sm" className="ml-2">
        Upload Image +
      </Button>
    );
  }
}

export default CloudinaryUploadWidget;
