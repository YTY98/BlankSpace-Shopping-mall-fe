import React from "react";
import { Modal } from "react-bootstrap";

const SizeGuideModal = ({ show, onClose, height, weight }) => {
  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Size Guide & Wash Methods</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Size Chart</h5>
        <p>
          Here is a size guide to help you choose the right size for your
          product.
        </p>
        <table className="table">
          <thead>
            <tr>
              <th>Size</th>
              <th>Chest (cm)</th>
              <th>Waist (cm)</th>
              <th>Center Back Length (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>S</td>
              <td>86-91</td>
              <td>71-76</td>
              <td>91-96</td>
            </tr>
            <tr>
              <td>M</td>
              <td>92-97</td>
              <td>77-82</td>
              <td>97-102</td>
            </tr>
            <tr>
              <td>L</td>
              <td>98-103</td>
              <td>83-88</td>
              <td>103-108</td>
            </tr>
            <tr>
              <td>XL</td>
              <td>104-109</td>
              <td>89-94</td>
              <td>109-114</td>
            </tr>
          </tbody>
        </table>

        <h5>Model's Information</h5>
        <table className="table">
          <tbody>
            <tr>
              <td>Height</td>
              <td>{height ? `${height} cm` : "Not Provided"}</td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>{weight ? `${weight} kg` : "Not Provided"}</td>
            </tr>
          </tbody>
        </table>

        <h5>Wash Methods</h5>
        <p>Here are the recommended wash methods for your product.</p>
        <table className="table">
          <tbody>
            <tr>
              <td>Cotton (면)</td>
              <td>
                수축이 생길 수 있어 낮은 온도의 물세탁을 권장드립니다. 알칼리성,
                중성 세제 모두 사용 가능하며 세탁기를 사용해도 괜찮습니다.
              </td>
            </tr>
            <tr>
              <td>Linen (린넨)</td>
              <td>
                세탁기를 사용해도 괜찮지만 구김이 생길 수 있어 빨래망 사용을
                권장드립니다.
              </td>
            </tr>
            <tr>
              <td> Oxford(옥스퍼드)</td>
              <td>
                물세탁시 약간의 수축이 일어날 수도 있으니 드라이클리닝
                권장드립니다.
              </td>
            </tr>
            <tr>
              <td>Cashmere (캐시미어)</td>
              <td>
                드라이클리닝을 권장드리며 울샴푸나 중성샴푸로 손세탁을
                권장드립니다. 비비거나 비틀시 옷의 변형이 일어날 수도 있습니다.
              </td>
            </tr>
            <tr>
              <td>Wool (모직)</td>
              <td>
                드라이클리닝을 권장드리며 저온 세탁 및 그늘 건조를 권장드립니다.
              </td>
            </tr>
          </tbody>
        </table>
      </Modal.Body>
    </Modal>
  );
};

export default SizeGuideModal;
