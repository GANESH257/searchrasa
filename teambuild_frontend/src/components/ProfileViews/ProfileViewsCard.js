import classes from "./ProfileViewsCard.module.css";
import { CgProfile } from "react-icons/cg";
import React, { useState } from "react";
import Modal from "../UI/Modal";

import { GrMail } from "react-icons/gr";
import { BsFillTelephoneFill } from "react-icons/bs";

const ModalWrapper = {
  height: "60%",
  width: "30rem",
  left: "calc(50% - 15rem)",
  borderRadius: "10px",
};
const ItemActions = {
  padding: "2px",
  // "text-align": "center",
  // "border-top": "1px solid #ccc",
  height: "14%",
};

const ModalHeader = {
  height: "20%",
  // "font-family": "Montserrat",
  background:"#264ECA",
  
};

const ItemModal = {
  padding: "0",
  height: "100%",
};

const ProfileViewsCard = (props) => {
  const [showModal, setShowModal] = useState(false);

  const openModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
    setShowModal(false);
  };

  const header = "";
  const modalFooter = (
    <React.Fragment>
      {/* <UploadButton onClick={uploadImageButtonHandle} disabled={!previewUrl}>
        Upload
      </UploadButton>
      {/* {profilePhotoUrl && (
        <RemoveButton onClick={removeImageButtonHandle}>Remove</RemoveButton>
      )} */}
      <div className={classes.ModalFooter}>
        <button onClick={closeModalHandler}>Close</button>
      </div>
    </React.Fragment>
  );

  const modal = (
    <Modal
      show={showModal}
      modalWrapper={ModalWrapper}
      onCancel={closeModalHandler}
      modalHeader={ModalHeader}
      contentClass={ItemModal}
      header={header}
      footerClass={ItemActions}
      footer={modalFooter}
    >
      <div className="form-control">
        <div className={classes.ModalMainContent}>
          <div className={classes.ProfilePic}>
            <div className={classes.ProfilePicInner}> </div>
          </div>
          <div className={classes.ModalProfileName}>John</div>
          <div className={classes.ModalCaption}>
            I love building and managing Software
          </div>
          <div className={classes.ModalMainInfo}>
            <div className={classes.IconsClass}>
              <GrMail className={classes.IconsSvg} />
            </div>
            <div className={classes.UserContent}>John@gmail.com</div>
          </div>
          <div className={classes.ModalMainInfo}>
            <div className={classes.IconsClass}><BsFillTelephoneFill className={classes.IconsSvg} /></div>
            <div className={classes.UserContent}>5754754546</div>
          </div>
        </div>
        {/* {!isValid && <p>'error'</p>} */}
      </div>
    </Modal>
  );

  return (
    <React.Fragment>
      {modal}
      <div className={classes.CardWrapper} onClick={openModalHandler}>
        <div className={classes.CardInnerWrapper}>
          <div className={classes.Intro}>
            <div className={classes.PhotoSection}>
              <div className={classes.AvatarWrapper}>
                <CgProfile className={classes.Avatar} />
              </div>
            </div>
            <div className={classes.BasicInfoSection}>
              <div className={classes.NameWrapper}>
                <p>John</p>
              </div>
              <div className={classes.StatusWrapper}>
                <p>Open to Work</p>
              </div>
              <div className={classes.LocationWrapper}>
                <p>London,UK</p>
              </div>
            </div>
          </div>
          <section className={classes.MainContent}>
            <div>
              <div className={classes.LabelWrapper}>
                <p>I'm a :</p>
                <span className={classes.ContentWrapper}>BackendDeveloper</span>
              </div>
              <div className={classes.LabelWrapper}>
                <p>Industry :</p>
                <span className={classes.ContentWrapper}>Software</span>
              </div>
              <div className={classes.LabelWrapper}>
                <p>Function :</p>
                <span className={classes.ContentWrapper}>Developer</span>
              </div>
              <div className={classes.LabelWrapper}>
                <p>Skillset :</p>
                <span className={classes.ContentWrapper}>Coder</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProfileViewsCard;
