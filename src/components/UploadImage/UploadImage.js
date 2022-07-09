import { useState, useEffect } from 'react';
import {
  getDownloadURL, uploadBytes, deleteObject, ref,
} from 'firebase/storage';
import PropTypes from 'prop-types';
import { storage } from '../../utils/firebaseInit';
import loadImage from '../../images/gallery.svg';

function UploadImage({ imgUrl, setImgUrl }) {
  const [image, setImage] = useState();
  const [imgPath, setImgPath] = useState('');

  useEffect(() => {
    if (image) {
      const uploadImg = async () => {
        const imgRef = ref(storage, `event/${new Date()}`);
        if (imgPath) {
          await deleteObject(ref(storage, imgPath));
        }
        const snap = await uploadBytes(imgRef, image);
        const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
        setImgUrl(url);
        setImgPath(snap.ref.fullPath);
        setImage(undefined);
      };
      uploadImg();
    }
  }, [image, imgPath, setImgUrl]);

  return (
    <>
      <div style={{ letterSpacing: '2px' }}>上傳活動圖片</div>
      <label
        htmlFor="photo"
        style={{
          width: '300px',
          height: '220px',
          marginTop: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgb(238, 238, 238)',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt="event"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <img src={loadImage} alt="請上傳圖片" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        )}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="photo"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
      </label>
    </>
  );
}

UploadImage.propTypes = {
  imgUrl: PropTypes.string.isRequired,
  setImgUrl: PropTypes.func.isRequired,
};

export default UploadImage;
