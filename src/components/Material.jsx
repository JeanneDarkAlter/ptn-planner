import '../css/Material.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfo, faToolbox } from '@fortawesome/free-solid-svg-icons'
import { useContext, useState } from 'react'
import { UpgradeContext } from './Upgrading'
import { autoPlacement, computePosition } from '@floating-ui/dom'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  safePolygon
} from '@floating-ui/react'

function Material ({ ...material }) {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), autoPlacement(), shift()],
    whileElementsMounted: autoUpdate
  })
  const hover = useHover(context, { handleClose: safePolygon() })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, {
    role: 'label'
  })

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role
  ])

  const setMaterials = useContext(UpgradeContext).setMaterials
  let mat = JSON.parse(localStorage.getItem('materials')).find(
    m => m.name === material.name
  )
  //NOTE: new mat

  const [value, setValue] = useState(Number(mat.amount).toString())

  const handleAmountChange = event => {
    setValue(event.target.value)
    let materials = JSON.parse(localStorage.getItem('materials'))
    for (let i = 0; i < materials.length; i++) {
      if (materials[i].name === material.name) {
        materials[i].amount = Number(event.target.value).toString()
        // if (materials[i].amount === "" || parseInt(materials[i].needed) === 0) {
        //     document.getElementById(materials[i].name).style.backgroundColor = "slategray";
        // }
        // else if (parseInt(materials[i].amount) >= parseInt(materials[i].needed)) {
        //     document.getElementById(materials[i].name).style.backgroundColor = "#184618"; /* green */
        // }
        // else {
        //     document.getElementById(materials[i].name).style.backgroundColor = "#461818"; /* red */
        // }
        break
      }
    }
    localStorage.setItem('materials', JSON.stringify(materials))
    setMaterials(materials)
  }

  const onBluring = event => {
    event.target.value = event.target.value.replace(/^0+(?=\d)/, '')
  }

  const calcChests = () => {
    if (material.rarity === 'PC-LR') {
      let mat_name = material.name.split(' ')[0]
      if (material.purpose === 'general' && material.chests) {
        let mat_ii = JSON.parse(localStorage.getItem('materials')).find(
          m => m.name === mat_name + ' II'
        )
        let mat_iii = JSON.parse(localStorage.getItem('materials')).find(
          m => m.name === mat_name + ' III'
        )
        let mat_iv = JSON.parse(localStorage.getItem('materials')).find(
          m => m.name === mat_name + ' IV'
        )
        let chest = JSON.parse(localStorage.getItem('materials')).find(
          m =>
            m.purpose === 'chest' &&
            m.rarity === material.rarity &&
            m.for === material.purpose
        )
        // return (
        //   'You can open ' +
        //   Math.max(
        //     Math.min(
        //       chest.amount,
        //       (mat_ii.needed - mat_ii.amount) * 3 +
        //         (mat_iii.needed - mat_iii.amount) * 9 +
        //         (mat_iv.needed - mat_iv.amount) * 27 +
        //         (mat.needed - mat.amount)
        //     ),
        //     0
        //   ) +
        //   ' ' +
        //   chest.name +
        //   ' chest'
        // )
        return Math.max(
          Math.min(
            chest.amount,
            (mat_ii.needed - mat_ii.amount) * 3 +
              (mat_iii.needed - mat_iii.amount) * 9 +
              (mat_iv.needed - mat_iv.amount) * 27 +
              (mat.needed - mat.amount)
          ),
          0
        )
      }
    } else if (material.rarity === 'PC-CR') {
      let mat_name = material.name.split(' ')[0]
      if (material.purpose === 'general' && material.chests) {
        let mat_iii = JSON.parse(localStorage.getItem('materials')).find(
          m => m.name === mat_name + ' III'
        )
        let mat_iv = JSON.parse(localStorage.getItem('materials')).find(
          m => m.name === mat_name + ' IV'
        )
        let chest = JSON.parse(localStorage.getItem('materials')).find(
          m =>
            m.purpose === 'chest' &&
            m.rarity === material.rarity &&
            m.for === material.purpose
        )
        // return (
        //   'You can open ' +
        //   Math.max(
        //     Math.min(
        //       chest.amount,
        //       (mat_iii.needed - mat_iii.amount) * 3 +
        //         (mat_iv.needed - mat_iv.amount) * 9 +
        //         (mat.needed - mat.amount - mat.canCraft)
        //     ),
        //     0
        //   ) +
        //   ' ' +
        //   chest.name +
        //   ' chest'
        // )
        return Math.max(
          Math.min(
            chest.amount,
            (mat_iii.needed - mat_iii.amount) * 3 +
              (mat_iv.needed - mat_iv.amount) * 9 +
              (mat.needed - mat.amount - mat.canCraft)
          ),
          0
        )
      } else if (material.purpose === 'phaseup' && material.chests) {
        let mat_ii = JSON.parse(localStorage.getItem('materials')).find(
          m => m.name === mat_name + ' II'
        )
        let mat_iii = JSON.parse(localStorage.getItem('materials')).find(
          m => m.name === mat_name + ' III'
        )
        let chest = JSON.parse(localStorage.getItem('materials')).find(
          m =>
            m.purpose === 'chest' &&
            m.rarity === material.rarity &&
            m.for === material.purpose
        )
        // return (
        //   'You can open ' +
        //   Math.max(
        //     Math.min(
        //       chest.amount,
        //       (mat_ii.needed - mat_ii.amount) * 3 +
        //         (mat_iii.needed - mat_iii.amount) * 9 +
        //         (mat.needed - mat.amount)
        //     ),
        //     0
        //   ) +
        //   ' ' +
        //   chest.name +
        //   ' chest'
        // )
        return Math.max(
          Math.min(
            chest.amount,
            (mat_ii.needed - mat_ii.amount) * 3 +
              (mat_iii.needed - mat_iii.amount) * 9 +
              (mat.needed - mat.amount)
          ),
          0
        )
      }
    } else if (material.rarity === 'PC-AR') {
      let mat_name = material.name.split(' ')[0]
      if (material.purpose === 'general' && material.chests) {
        let mat_iv = JSON.parse(localStorage.getItem('materials')).find(
          m => m.name === mat_name + ' IV'
        )
        let chest = JSON.parse(localStorage.getItem('materials')).find(
          m =>
            m.purpose === 'chest' &&
            m.rarity === material.rarity &&
            m.for === material.purpose
        )
        // return (
        //   'You can open ' +
        //   Math.max(
        //     Math.min(
        //       chest.amount,
        //       (mat_iv.needed - mat_iv.amount) * 3 +
        //         (mat.needed - mat.amount - mat.canCraft)
        //     ),
        //     0
        //   ) +
        //   ' ' +
        //   chest.name +
        //   ' chest'
        // )
        return Math.max(
          Math.min(
            chest.amount,
            (mat_iv.needed - mat_iv.amount) * 3 +
              (mat.needed - mat.amount - mat.canCraft)
          ),
          0
        )
      } else if (material.purpose === 'phaseup' && material.chests) {
        let mat_iv = JSON.parse(localStorage.getItem('materials')).find(
          m => m.name === mat_name + ' III'
        )
        let chest = JSON.parse(localStorage.getItem('materials')).find(
          m =>
            m.purpose === 'chest' &&
            m.rarity === material.rarity &&
            m.for === material.purpose
        )
        // return (
        //   'You can open ' +
        //   Math.max(
        //     Math.min(
        //       chest.amount,
        //       (mat_iv.needed - mat_iv.amount) * 3 +
        //         (mat.needed - mat.amount - mat.canCraft)
        //     ),
        //     0
        //   ) +
        //   ' ' +
        //   chest.name +
        //   ' chest'
        // )
        return Math.max(
          Math.min(
            chest.amount,
            (mat_iv.needed - mat_iv.amount) * 3 +
              (mat.needed - mat.amount - mat.canCraft)
          ),
          0
        )
      }
    } else if (material.rarity === 'PC-GR') {
      if (material.purpose === 'general' && material.chests) {
        let chest = JSON.parse(localStorage.getItem('materials')).find(
          m =>
            m.purpose === 'chest' &&
            m.rarity === material.rarity &&
            m.for === material.purpose
        )
        // return (
        //   'You can open ' +
        //   Math.max(
        //     Math.min(chest.amount, mat.needed - mat.amount - mat.canCraft),
        //     0
        //   ) +
        //   ' ' +
        //   chest.name +
        //   ' chest'
        // )
        return Math.max(
          Math.min(chest.amount, mat.needed - mat.amount - mat.canCraft),
          0
        )
      } else if (material.purpose === 'phaseup' && material.chests) {
        let chest = JSON.parse(localStorage.getItem('materials')).find(
          m =>
            m.purpose === 'chest' &&
            m.rarity === material.rarity &&
            m.for === material.purpose
        )
        // return (
        //   'You can open ' +
        //   Math.max(
        //     Math.min(chest.amount, mat.needed - mat.amount - mat.canCraft),
        //     0
        //   ) +
        //   ' ' +
        //   chest.name +
        //   ' chest'
        // )
        return Math.max(
          Math.min(chest.amount, mat.needed - mat.amount - mat.canCraft),
          0
        )
      }
    }
  }

  let chestAmount = calcChests()

  const openChests = () => {
    mat.amount += chestAmount
    let chest = JSON.parse(localStorage.getItem('materials')).find(
      m =>
        m.purpose === 'chest' &&
        m.rarity === material.rarity &&
        m.for === material.purpose
    )
    chest.amount -= chestAmount
    setValue(mat.amount)

    let materials = JSON.parse(localStorage.getItem('materials'))
    for (let i = 0; i < materials.length; i++) {
      if (materials[i].name === material.name) {
        materials[i].amount = mat.amount
      } else if (materials[i].name === chest.name) {
        materials[i].amount = chest.amount
      }
    }
    localStorage.setItem('materials', JSON.stringify(materials))
    setMaterials(materials)
    // window.location.reload()
  }

  return (
    <div
      className='mat'
      key={material.name}
      id={material.name}
      style={{
        backgroundColor:
          parseInt(mat.needed) === 0
            ? 'gray'
            : parseInt(mat.amount) >= parseInt(mat.needed) ||
              parseInt(mat.amount) + parseInt(material.canCraft) >=
                parseInt(mat.needed)
            ? '#184618'
            : '#461818'
      }}
    >
      {/* green : red*/}
      {/* {material.stages !== null && (
        <div>
          <FontAwesomeIcon
            icon={faInfo}
            style={{ color: '#ffffff' }}
            className='info'
          />
          <span className='tooltip'>How to get: {material.stages}</span>
        </div>
      )} */}

      {/* <div>
        {material.chests !== undefined && (
          <FontAwesomeIcon
            icon={faToolbox}
            style={{ color: '#ffffff' }}
            className='info'
          />
        )}
        <span className='tooltip'>{calcChests()}</span>
      </div> */}

      <div>
        {material.chests !== undefined && (
          <button
            style={{ background: 'none', border: 'none' }}
            className='info'
            ref={refs.setReference}
            {...getReferenceProps()}
            onClick={openChests}
          >
            <FontAwesomeIcon icon={faToolbox} style={{ color: '#ffffff' }} />
          </button>
        )}
        {isOpen && (
          <div
            className='tooltip'
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {chestAmount > 0 && <p> You can open {chestAmount} chests.</p>}
            {chestAmount <= 0 && <p> You can't open any chests.</p>}
          </div>
        )}
        {/* <span className='tooltip'>{calcChests()}</span> */}
      </div>

      <img src={material.img} alt='' height={50} />
      <p>{material.name}</p>
      <p>{mat.needed}</p>
      {material.canCraft > 0 && <p>Can be crafted: {material.canCraft}</p>}
      <input
        type='number'
        min={0}
        onKeyPress={event => {
          if (!/[0-9]/.test(event.key)) {
            event.preventDefault()
          }
        }}
        style={{ width: '100px' }}
        name=''
        id=''
        // defaultValue={Number(mat.amount).toString()}
        value={value}
        onChange={handleAmountChange}
        onBlur={onBluring}
      />
    </div>
  )
}

export default Material
