import { useState } from "react";
import product from "../data/product"
import "../stylesheet/ShowDetail.css"

function ShowDetail(){

    const num = product[0].price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const [quantity, setQuantity] = useState(1);

    function add(){
        setQuantity(quantity+1)
    }

    function sub(){
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
                        <div className="sub-button" onClick={sub}>
                            <img src="" alt="" />
                        </div>
                        <span className="num-of-quantity">
                            {quantity}
                        </span>
                        <div className="add-button" onClick={add}>
                            <img src="" alt="" />
                        </div>
                    </div>
                    <div className="button-box">
                        <div className="cart-button">
                            เพิ่มลงตะกร้า
                        </div>
                        <div className="order-button">
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
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates eius eveniet, consequuntur maiores deserunt doloribus cumque molestias accusamus dicta voluptatum magnam laudantium, incidunt sed praesentium? Placeat facilis maxime voluptate tenetur iure fugit sapiente esse, animi maiores necessitatibus inventore expedita unde provident odio atque sit aliquid hic quasi, delectus quisquam laboriosam repellat repudiandae. Nemo ex architecto dolorem cupiditate? Maxime quis molestiae corporis atque ut sit exercitationem totam! Pariatur deleniti sed quasi possimus vero vitae quibusdam quia magnam, necessitatibus nihil laboriosam autem ut. Aliquid corporis et eveniet excepturi mollitia? Atque ducimus dolorum dignissimos minima nulla, alias nostrum nihil, neque quos dolores saepe temporibus iure ipsa! Maxime dicta est voluptatibus debitis alias quibusdam amet nobis animi recusandae, sit quaerat iusto deleniti ratione repellat a, architecto incidunt facilis. Saepe exercitationem officia cum praesentium eveniet, ab expedita necessitatibus ad, quibusdam quisquam totam. Dolor rem voluptatibus neque repellat eius facilis quaerat ullam, corrupti similique perferendis recusandae libero quam, laborum possimus fuga eligendi vel, itaque suscipit vero. Delectus, porro nihil! Doloribus quibusdam labore amet facere accusamus modi, voluptates, consequuntur consectetur praesentium ipsam eum corrupti expedita temporibus sunt explicabo esse dolore laudantium aperiam, dignissimos nihil est ex ut. Nulla, aperiam. Exercitationem consequatur sunt numquam sed dolore, vel nisi illo eum quam nulla illum ab aperiam animi ullam facere natus at! Error, ducimus repudiandae placeat iusto laborum a nisi maiores deserunt consequuntur ad nesciunt, veniam laboriosam quod nam impedit minima qui autem fugit, ullam eaque. Eaque recusandae vero ab. Sint, nobis labore esse amet maxime dolore sed sit quod obcaecati expedita sapiente quos voluptates est eaque voluptas eum temporibus dignissimos velit. Itaque veniam placeat repellendus quod rem similique saepe quidem nam assumenda voluptatibus sequi officiis veritatis est, necessitatibus, dicta eaque deserunt, perferendis numquam odio! Iusto deserunt fugiat et in fuga vero dolore a ipsa voluptatum laudantium doloribus voluptates dolores corrupti, animi itaque quibusdam consequatur tempora distinctio laboriosam. Est atque quos rerum. Consequatur at, saepe porro obcaecati deserunt culpa autem itaque ipsam, quam recusandae ducimus provident suscipit commodi sunt dolores vel. Ratione illo quidem, exercitationem eligendi animi odit id, aliquam eaque quae deserunt eius quo iure praesentium ab qui vero maxime veritatis tempora et beatae rerum pariatur fugiat dicta voluptatem? Ratione eveniet libero sunt obcaecati quos architecto quaerat accusamus non quam! Rerum veritatis repellat nihil eius velit? Minima quasi non sit, assumenda eos, quia totam, sed amet omnis cupiditate magni molestiae mollitia deserunt nisi? Quisquam impedit, itaque voluptas et minima deleniti quae expedita consectetur assumenda enim voluptatum voluptatibus incidunt tempore culpa officiis error ad nostrum ratione rem possimus reiciendis dolorem. Eligendi unde minus iure illo, provident optio repellat soluta quo sequi quia. Provident eum qui dolorum laborum dignissimos. Ipsa iste qui tenetur esse quae beatae rerum adipisci animi et totam, dolorem perspiciatis, illo possimus! Dolore aliquid recusandae quisquam corporis rem. Quia voluptatibus nam quo obcaecati itaque unde odio dolor, expedita autem delectus esse quidem totam officiis tempore dolorum est ea iure qui distinctio sapiente dicta facilis! Voluptatum eveniet nam commodi aspernatur non, eaque dolorum ipsa tempora inventore dolor labore optio?
                </div>
            </div>
            
        </div>
    )
}

export default ShowDetail