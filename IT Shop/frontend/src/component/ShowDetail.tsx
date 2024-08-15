import { useState } from "react";
import product from "../data/product"
import "../stylesheet/ShowDetail.css"

function ShowDetail(){

    const num = product[0].price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const [quantity, setQuantity] = useState(1);

    function add(){
        setQuantity(quantity+1)
    }

    function minus(){
        if (quantity==1){
            setQuantity(1)
        }
        else {
            setQuantity(quantity-1)
        }
    }

    return (
        <div className="showdetail-container">
            <div className="main-detail">
                <div className="text-box">
                    <div className="sub-text-box">
                        <div className="productname-box">
                            {product[0].productName}
                        </div>
                        <div className="brand-box">
                            Brand: {product[0].brand}<br/>
                            Sold : 953
                        </div>
                    </div>
                    <div className="price-box">
                        ฿{num}
                    </div>
                </div>
                <div className="active-box">
                    <div className="quantity-box">
                        <span>Quantity:</span>
                        <div className="quantity-btn" id="minus-button" onClick={minus}>
                            −
                        </div>
                        <span className="num-of-quantity">
                            {quantity}
                        </span>
                        <div className="quantity-btn" id="add-button" onClick={add}>
                            +
                        </div>
                    </div>
                    <div className="button-box">
                        <div className="btn" id="cart-button">
                            เพิ่มลงตะกร้า
                        </div>
                        <div className="btn" id="order-button">
                            ซื้อทันที
                        </div>
                    </div>
                </div> 
            </div>

            <div className="description-box">
                <div className="line"></div>
                <span>
                    Description
                </span>
                <div className="text-box">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptatum, adipisci vitae in eaque sunt veniam provident aut nam autem consequatur, molestias qui ex saepe enim reiciendis! Excepturi ipsum fugiat earum eum voluptatibus laborum aspernatur deleniti perspiciatis repudiandae natus tempore molestias, nihil magni explicabo maxime dolore qui optio eaque! Error fugiat eaque officia nam deleniti nisi. Cum, repellat! Incidunt ex laudantium quis aliquam iste pariatur maxime nisi, asperiores nesciunt laboriosam placeat ducimus minima odio, dignissimos officiis totam consequatur. Magni blanditiis nesciunt illum quo sapiente numquam, molestiae itaque. Molestiae consequuntur ullam excepturi? Distinctio nemo at id, delectus in corrupti iusto! Ab, ullam, perferendis expedita facilis, vel atque sunt dolores dolorum similique nihil quod ducimus vero? Cupiditate maxime soluta debitis ut error. Corrupti ducimus amet expedita. Amet veritatis suscipit deserunt quidem non sint aliquam, laudantium nisi quos consequuntur illo dolore nihil repellendus sunt porro molestias! Commodi architecto beatae tempore vitae. Atque sapiente similique quasi ipsam provident, dolor voluptatibus nam dolorem modi. Corrupti, eaque vel inventore magnam doloremque harum aperiam voluptates dolorem labore corporis. Blanditiis praesentium saepe accusamus aliquam nobis alias dolorem consequuntur aperiam atque, eaque, totam ab cupiditate architecto neque ad eligendi quis maiores maxime officia placeat. Fugiat, sapiente? Praesentium, iusto minima!quos consequuntur illo dolore nihil repellendus sunt porro molestias! Commodi architecto beatae tempore vitae. Atque sapiente similique quasi ipsam provident, dolor voluptatibus nam dolorem modi. Corrupti, eaque vel inventore magnam doloremque harum aperiam voluptates dolorem labore corporis. Blanditiis praesentium saepe accusamus aliquam nobis alias dolorem consequuntur aperiam atque, eaque, totam ab cupiditate architecto neque ad eligendi quis maiores maxime officia placeat. Fugiat, sapiente? Praesentium, iusto minima!
                </div>
            </div>
            
        </div>
    )
}

export default ShowDetail;