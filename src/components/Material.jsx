import '../css/Material.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo } from '@fortawesome/free-solid-svg-icons'
import { useContext } from "react";
import { UpgradeContext } from "./Upgrading";

function Material({ ...material }) {
    const setMaterials = useContext(UpgradeContext).setMaterials;
    let mat = JSON.parse(localStorage.getItem("materials")).find(m => m.name === material.name);
    //NOTE: new mat

    const handleAmountChange = event => {
        let materials = JSON.parse(localStorage.getItem("materials"));
        for (let i = 0; i < materials.length; i++) {
            if (materials[i].name === material.name) {
                materials[i].amount = Number(event.target.value).toString();
                // if (materials[i].amount === "" || parseInt(materials[i].needed) === 0) {
                //     document.getElementById(materials[i].name).style.backgroundColor = "slategray";
                // }
                // else if (parseInt(materials[i].amount) >= parseInt(materials[i].needed)) {
                //     document.getElementById(materials[i].name).style.backgroundColor = "#184618"; /* green */
                // }
                // else {
                //     document.getElementById(materials[i].name).style.backgroundColor = "#461818"; /* red */
                // }
                break;
            }
        }
        localStorage.setItem("materials", JSON.stringify(materials));
        setMaterials(materials);
    }

    const onBluring = event => {
        event.target.value = event.target.value.replace(/^0+(?=\d)/, '')
    }

    if (material.name === "Twilight II") {
        console.log((parseInt(mat.amount) >= parseInt(mat.needed) || parseInt(mat.amount) + parseInt(material.canCraft) >= parseInt(mat.needed)));
    }

    return (
        <div className="mat" key={material.name} id={material.name} style={{ backgroundColor: parseInt(mat.needed) === 0 ? "gray" : (parseInt(mat.amount) >= parseInt(mat.needed) || parseInt(mat.amount) + parseInt(material.canCraft) >= parseInt(mat.needed)) ? "#184618" : "#461818" }}>{/* green : red*/}
            {
                material.stages !== null && <div><FontAwesomeIcon icon={faInfo} style={{ color: "#ffffff", }} className="info" />
                    <span className="tooltip">How to get: {material.stages}</span>
                </div>
            }
            <img src={material.img} alt="" height={50} />
            <p>{material.name}</p>
            <p>{mat.needed}</p>
            {
                material.canCraft > 0 && <p>Can be crafted: {material.canCraft}</p>
            }
            <input type="number" min={0} onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                }
            }} style={{ width: "100px" }} name="" id="" defaultValue={Number(mat.amount).toString()} onChange={handleAmountChange} onBlur={onBluring} />
        </div>
    )
}

export default Material;