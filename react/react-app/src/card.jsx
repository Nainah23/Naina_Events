import profilePic from "./assets/IMG_1220 (2).jpg";

function Card() {
  return (
    <div className="card">
        <img className="card-img" src={profilePic} alt="My profile picture" />
        <h2> className="card-title" Cheki Jamaa Dangamanya</h2>
        <p>Ako bie sio?Huezi kataa boss!!</p>
    </div>
  );
}
export default Card;