function Food(){
    const food1 = "Pizza";
    const food2 = "Burger";
    const food3 = "Pasta";
   
   
    return (
        <ul>
            <li>{food1}</li>
            <li>{food2.toUpperCase()}</li>
            <li>{food3}</li>
            <li>Mukimo Fry - (Chef's Fav)</li>
        </ul>
    );
}
export default Food;