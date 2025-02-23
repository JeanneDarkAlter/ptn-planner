import Popup from 'reactjs-popup'
import { useContext, useState } from 'react'
import { UpgradeContext } from './Upgrading'

function CharUpgrade ({ ...character }) {
  //NOTE: new version
  let upgrade = JSON.parse(localStorage.getItem('upgrade')).find(
    u => u.id === character.id
  )
  const [charData, setCharData] = useState({
    currPhase: upgrade.currPhase,
    goalPhase: upgrade.goalPhase,
    currSkill1: upgrade.currSkill1,
    goalSkill1: upgrade.goalSkill1,
    currSkill2: upgrade.currSkill2,
    goalSkill2: upgrade.goalSkill2,
    currSkill3: upgrade.currSkill3,
    goalSkill3: upgrade.goalSkill3,
    currSkill4: upgrade.currSkill4,
    goalSkill4: upgrade.goalSkill4,
    currECB: upgrade.currECB,
    goalECB: upgrade.goalECB
  })

  console.log(charData)

  //NOTE: old version
  /*const [charData, setCharData] = useState({
        currPhase: character.currPhase,
        goalPhase: character.goalPhase,
        currSkill1: character.currSkill1,
        goalSkill1: character.goalSkill1,
        currSkill2: character.currSkill2,
        goalSkill2: character.goalSkill2,
        currSkill3: character.currSkill3,
        goalSkill3: character.goalSkill3,
        currSkill4: character.currSkill4,
        goalSkill4: character.goalSkill4,
    });*/

  const materials = useContext(UpgradeContext).materials
  const setMaterials = useContext(UpgradeContext).setMaterials
  const setUpgrade = useContext(UpgradeContext).setUpgrade

  const phasesDict = {
    0: '1\u25C7\u25C7\u25C7',
    1: '20\u25C7\u25C7\u25C7',
    2: '20\u25C6\u25C7\u25C7',
    3: '40\u25C6\u25C7\u25C7',
    4: '40\u25C6\u25C6\u25C7',
    5: '70\u25C6\u25C6\u25C7',
    6: '70\u25C6\u25C6\u25C6',
    7: '80\u25C6\u25C6\u25C6',
    8: '85\u25C6\u25C6\u25C6',
    9: '90\u25C6\u25C6\u25C6'
  }

  //NOTE: изменения в форме
  const handleChanges = event => {
    setCharData(prevState => {
      let sub = ''
      if (event.target.name.includes('curr')) {
        sub = document.getElementById(event.target.name.replace('curr', 'goal'))
      } else if (event.target.name.includes('goal')) {
        sub = document.getElementById(event.target.name.replace('goal', 'curr'))
      }
      return {
        ...prevState,
        [event.target.name]: event.target.value,
        [sub.name]: sub.value
      }
    })
  }

  //NOTE: валидация input'ов
  const handleInputValidation1 = event => {
    let goal = 'goalSkill' + event.target.id.charAt(event.target.id.length - 1)
    let goalEl = document.getElementById(goal)
    if (parseInt(event.target.value) >= parseInt(event.target.max)) {
      event.target.value = event.target.max
      goalEl.value = event.target.max
    }
    if (parseInt(event.target.value) < parseInt(event.target.min)) {
      event.target.value = event.target.min
    }
    if (parseInt(event.target.value) > parseInt(goalEl.value)) {
      goalEl.value = event.target.value
    }
    if (event.target.value === '') {
      event.target.value = event.target.min
    }
  }

  const handleInputValidation2 = event => {
    let current =
      'currSkill' + event.target.id.charAt(event.target.id.length - 1)
    let currentEl = document.getElementById(current)
    if (parseInt(event.target.value) > parseInt(event.target.max)) {
      event.target.value = event.target.max
    }
    if (parseInt(event.target.value) < parseInt(currentEl.value)) {
      currentEl.value = event.target.value
    }
    if (parseInt(event.target.value) < parseInt(event.target.min)) {
      event.target.value = event.target.min
      currentEl.value = event.target.min
    }
  }

  //NOTE: валидация списков
  const handleSelectValidation1 = event => {
    let goalEl = document.getElementById(
      event.target.name.replace('curr', 'goal')
    )
    if (parseInt(event.target.value) > parseInt(goalEl.value)) {
      goalEl.value = event.target.value
    }
  }

  const handleSelectValidation2 = event => {
    let currentEl = document.getElementById(
      event.target.name.replace('goal', 'curr')
    )
    if (parseInt(event.target.value) < parseInt(currentEl.value)) {
      currentEl.value = event.target.value
    }
  }

  //NOTE: две функции
  const twoFunctions = event => {
    handleChanges(event)
    if (event.target.name.includes('currSkill')) {
      handleInputValidation1(event)
    } else if (event.target.name.includes('goalSkill')) {
      handleInputValidation2(event)
    } else if (event.target.name.includes('currPhase')) {
      handleSelectValidation1(event)
    } else if (event.target.name.includes('goalPhase')) {
      handleSelectValidation2(event)
    }
  }

  const changeChar = () => {
    // console.log(JSON.parse(localStorage.getItem("materials")));
    // NOTE: upgrade == character
    for (
      let i = parseInt(upgrade.currPhase);
      i < parseInt(upgrade.goalPhase);
      i++
    ) {
      for (let j = 0; j < character.phases[i].length; j++) {
        let material = materials.find(m => m.name === character.phases[i][j][0])
        material.needed -= character.phases[i][j][1]
      }
    }
    for (
      let i = parseInt(upgrade.currSkill1);
      i < parseInt(upgrade.goalSkill1);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed -= character.skills[i - 1][j][1]
      }
    }
    for (
      let i = parseInt(upgrade.currSkill2);
      i < parseInt(upgrade.goalSkill2);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed -= character.skills[i - 1][j][1]
      }
    }
    for (
      let i = parseInt(upgrade.currSkill3);
      i < parseInt(upgrade.goalSkill3);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed -= character.skills[i - 1][j][1]
      }
    }
    for (
      let i = parseInt(upgrade.currSkill4);
      i < parseInt(upgrade.goalSkill4);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed -= character.skills[i - 1][j][1]
      }
    }
    for (
      let i = parseInt(upgrade.currECB);
      i < parseInt(upgrade.goalECB);
      i++
    ) {
      for (let j = 0; j < character.ecb[i].length; j++) {
        let material = materials.find(m => m.name === character.ecb[i][j][0])
        material.needed -= character.ecb[i][j][1]
      }
    }

    for (
      let i = parseInt(charData.currPhase);
      i < parseInt(charData.goalPhase);
      i++
    ) {
      for (let j = 0; j < character.phases[i].length; j++) {
        let material = materials.find(m => m.name === character.phases[i][j][0])
        material.needed += character.phases[i][j][1]
      }
    }
    for (
      let i = parseInt(charData.currSkill1);
      i < parseInt(charData.goalSkill1);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed += character.skills[i - 1][j][1]
      }
    }
    for (
      let i = parseInt(charData.currSkill2);
      i < parseInt(charData.goalSkill2);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed += character.skills[i - 1][j][1]
      }
    }
    for (
      let i = parseInt(charData.currSkill3);
      i < parseInt(charData.goalSkill3);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed += character.skills[i - 1][j][1]
      }
    }
    for (
      let i = parseInt(charData.currSkill4);
      i < parseInt(charData.goalSkill4);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed += character.skills[i - 1][j][1]
      }
    }
    for (
      let i = parseInt(charData.currECB);
      i < parseInt(charData.goalECB);
      i++
    ) {
      for (let j = 0; j < character.ecb[i].length; j++) {
        let material = materials.find(m => m.name === character.ecb[i][j][0])
        material.needed += character.ecb[i][j][1]
      }
    }
    localStorage.setItem('materials', JSON.stringify(materials))
    setMaterials(materials)

    //NOTE: new version
    upgrade.currPhase = charData.currPhase
    upgrade.goalPhase = charData.goalPhase
    upgrade.currSkill1 = charData.currSkill1
    upgrade.currSkill2 = charData.currSkill2
    upgrade.currSkill3 = charData.currSkill3
    upgrade.currSkill4 = charData.currSkill4
    upgrade.goalSkill1 = charData.goalSkill1
    upgrade.goalSkill2 = charData.goalSkill2
    upgrade.goalSkill3 = charData.goalSkill3
    upgrade.goalSkill4 = charData.goalSkill4
    upgrade.currECB = charData.currECB
    upgrade.goalECB = charData.goalECB

    //NOTE: old version
    /*character.currPhase = charData.currPhase;
        character.goalPhase = charData.goalPhase;
        character.currSkill1 = charData.currSkill1;
        character.currSkill2 = charData.currSkill2;
        character.currSkill3 = charData.currSkill3;
        character.currSkill4 = charData.currSkill4;
        character.goalSkill1 = charData.goalSkill1;
        character.goalSkill2 = charData.goalSkill2;
        character.goalSkill3 = charData.goalSkill3;
        character.goalSkill4 = charData.goalSkill4;*/

    let upgrades = JSON.parse(localStorage.getItem('upgrade'))
    upgrades = upgrades.map(value => {
      if (value.id === character.id) {
        return upgrade
      } else {
        return value
      }
    })

    localStorage.setItem('upgrade', JSON.stringify(upgrades))
    setUpgrade(upgrades)
    // window.location.reload();
  }

  const deleteChar = () => {
    console.log(upgrade)
    console.log(character)
    for (
      let i = parseInt(upgrade.currPhase);
      i < parseInt(upgrade.goalPhase);
      i++
    ) {
      for (let j = 0; j < character.phases[i].length; j++) {
        let material = materials.find(m => m.name === character.phases[i][j][0])
        material.needed -= character.phases[i][j][1]
      }
    }
    for (
      let i = parseInt(upgrade.currSkill1);
      i < parseInt(upgrade.goalSkill1);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed -= character.skills[i - 1][j][1]
      }
    }
    for (
      let i = parseInt(upgrade.currSkill2);
      i < parseInt(upgrade.goalSkill2);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed -= character.skills[i - 1][j][1]
      }
    }
    for (
      let i = parseInt(upgrade.currSkill3);
      i < parseInt(upgrade.goalSkill3);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed -= character.skills[i - 1][j][1]
      }
    }
    for (
      let i = parseInt(upgrade.currSkill4);
      i < parseInt(upgrade.goalSkill4);
      i++
    ) {
      for (let j = 0; j < character.skills[i - 1].length; j++) {
        let material = materials.find(
          m => m.name === character.skills[i - 1][j][0]
        )
        material.needed -= character.skills[i - 1][j][1]
      }
    }
    for (
      let i = parseInt(upgrade.currECB);
      i < parseInt(upgrade.goalECB);
      i++
    ) {
      for (let j = 0; j < character.ecb[i].length; j++) {
        let material = materials.find(m => m.name === character.ecb[i][j][0])
        material.needed -= character.ecb[i][j][1]
      }
    }

    localStorage.setItem('materials', JSON.stringify(materials))
    setMaterials(materials)

    let upgrades = JSON.parse(localStorage.getItem('upgrade'))
    console.log('BBB')
    console.log(upgrades)
    for (let i = 0; i < upgrades.length; i++) {
      console.log(upgrades[i])
      if (upgrades[i].id === character.id) {
        console.log('AAA')
        console.log(upgrades[i].name)
        console.log(character.name)
        upgrades.splice(i, 1)
        break
      }
    }

    localStorage.setItem('upgrade', JSON.stringify(upgrades))
    setUpgrade(upgrades)
  }

  const check = () => {
    let isChecked = true
    if (upgrade.currPhase !== upgrade.goalPhase) {
      isChecked = false
    }
    if (upgrade.currECB !== upgrade.goalECB) {
      isChecked = false
    }
    return isChecked ? 'green' : 'red'
  }

  let color =
    character.rank === 'S'
      ? '#f6af5a'
      : character.rank === 'A'
      ? '#b051f9'
      : '#4594df'

  return (
    <div style={{ display: 'flex' }}>
      <Popup
        trigger={
          <button
            id={character.name}
            style={{
              backgroundColor: 'black',
              border: '2px solid ' + check()
            }}
          >
            <div
              height={100}
              style={{
                display: 'block',
                border: '2px solid ' + color,
                backgroundColor: color,
                marginTop: 'auto',
                marginBottom: 'auto',
                marginLeft: '5px'
              }}
            >
              <img src={character.img} alt='' height={100} />
              <p style={{ margin: 0 }}>{character.name}</p>
            </div>
            <div
              style={{
                color: 'white',
                marginRight: '10px',
                marginLeft: '10px'
              }}
            >
              <p>
                {phasesDict[upgrade.currPhase]} {'>>'}{' '}
                {phasesDict[upgrade.goalPhase]}
              </p>
              <p>
                ECB: {upgrade.currECB} {'>>'} {upgrade.goalECB}
              </p>
              <p>
                N: {upgrade.currSkill1} {'>>'} {upgrade.goalSkill1}
              </p>
              <p>
                U: {upgrade.currSkill2} {'>>'} {upgrade.goalSkill2}
              </p>
              <p>
                P1: {upgrade.currSkill3} {'>>'} {upgrade.goalSkill3}
              </p>
              <p>
                P2: {upgrade.currSkill4} {'>>'} {upgrade.goalSkill4}
              </p>
            </div>
          </button>
        }
        modal
        nested
        position='center center'
      >
        {close => (
          <div className='character'>
            <button
              style={{ position: 'absolute', left: '90%' }}
              onClick={() => {
                close()
                deleteChar()
              }}
            >
              Delete
            </button>
            <div>
              <img src={character.img} alt='' />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <fieldset>
                <legend>Ascension & Skills</legend>
                <p>
                  {/* NOTE: upgrade == character */}
                  <label htmlFor='currPhase'>Current Phase: </label>
                  <select
                    id='currPhase'
                    name='currPhase'
                    onChange={twoFunctions}
                    defaultValue={upgrade.currPhase}
                  >
                    <option value='0'>1 &#x25C7; &#x25C7; &#x25C7;</option>
                    <option value='1'>20 &#x25C7; &#x25C7; &#x25C7;</option>
                    <option value='2'>20 &#x25C6; &#x25C7; &#x25C7;</option>
                    <option value='3'>40 &#x25C6; &#x25C7; &#x25C7;</option>
                    <option value='4'>40 &#x25C6; &#x25C6; &#x25C7;</option>
                    <option value='5'>70 &#x25C6; &#x25C6; &#x25C7;</option>
                    <option value='6'>70 &#x25C6; &#x25C6; &#x25C6;</option>
                    <option value='7'>80 &#x25C6; &#x25C6; &#x25C6;</option>
                    <option value='8'>85 &#x25C6; &#x25C6; &#x25C6;</option>
                    <option value='9'>90 &#x25C6; &#x25C6; &#x25C6;</option>
                    {/* <option value="0">
                                            &#x25C7;
                                            &#x25C7;
                                            &#x25C7;
                                        </option>
                                        <option value="1">
                                            &#x25C6;
                                            &#x25C7;
                                            &#x25C7;
                                        </option>
                                        <option value="2">
                                            &#x25C6;
                                            &#x25C6;
                                            &#x25C7;
                                        </option>
                                        <option value="3">
                                            &#x25C6;
                                            &#x25C6;
                                            &#x25C6;
                                        </option> */}
                  </select>
                </p>
                <p>
                  <label htmlFor='goalPhase'>Goal Phase: </label>
                  <select
                    id='goalPhase'
                    name='goalPhase'
                    onChange={twoFunctions}
                    defaultValue={upgrade.goalPhase}
                  >
                    <option value='0'>1 &#x25C7; &#x25C7; &#x25C7;</option>
                    <option value='1'>20 &#x25C7; &#x25C7; &#x25C7;</option>
                    <option value='2'>20 &#x25C6; &#x25C7; &#x25C7;</option>
                    <option value='3'>40 &#x25C6; &#x25C7; &#x25C7;</option>
                    <option value='4'>40 &#x25C6; &#x25C6; &#x25C7;</option>
                    <option value='5'>70 &#x25C6; &#x25C6; &#x25C7;</option>
                    <option value='6'>70 &#x25C6; &#x25C6; &#x25C6;</option>
                    <option value='7'>80 &#x25C6; &#x25C6; &#x25C6;</option>
                    <option value='8'>85 &#x25C6; &#x25C6; &#x25C6;</option>
                    <option value='9'>90 &#x25C6; &#x25C6; &#x25C6;</option>
                    {/* <option value="0">
                                            &#x25C7;
                                            &#x25C7;
                                            &#x25C7;
                                        </option>
                                        <option value="1">
                                            &#x25C6;
                                            &#x25C7;
                                            &#x25C7;
                                        </option>
                                        <option value="2">
                                            &#x25C6;
                                            &#x25C6;
                                            &#x25C7;
                                        </option>
                                        <option value="3">
                                            &#x25C6;
                                            &#x25C6;
                                            &#x25C6;
                                        </option> */}
                  </select>
                </p>
                <div className='skills'>
                  <div>
                    <p>Normal ATK</p>
                    <p>
                      <label htmlFor='currSkill1'>
                        Current LVL:{' '}
                        <input
                          type='number'
                          name='currSkill1'
                          id='currSkill1'
                          min='1'
                          max='10'
                          onChange={twoFunctions}
                          defaultValue={upgrade.currSkill1}
                        />
                      </label>
                    </p>
                    <p>
                      <label htmlFor='goalSkill1'>
                        Goal LVL:{' '}
                        <input
                          type='number'
                          name='goalSkill1'
                          id='goalSkill1'
                          min='1'
                          max='10'
                          onChange={twoFunctions}
                          defaultValue={upgrade.goalSkill1}
                        />
                      </label>
                    </p>

                    <p>Ultimate</p>
                    <p>
                      <label htmlFor='currSkill2'>
                        Current LVL:{' '}
                        <input
                          type='number'
                          name='currSkill2'
                          id='currSkill2'
                          min='1'
                          max='10'
                          onChange={twoFunctions}
                          defaultValue={upgrade.currSkill2}
                        />
                      </label>
                    </p>
                    <p>
                      <label htmlFor='goalSkill2'>
                        Goal LVL:{' '}
                        <input
                          type='number'
                          name='goalSkill2'
                          id='goalSkill2'
                          min='1'
                          max='10'
                          onChange={twoFunctions}
                          defaultValue={upgrade.goalSkill2}
                        />
                      </label>
                    </p>
                  </div>
                  <div>
                    <p>Passive 1</p>
                    <p>
                      <label htmlFor='currSkill3'>
                        Current LVL:{' '}
                        <input
                          type='number'
                          name='currSkill3'
                          id='currSkill3'
                          min='1'
                          max='10'
                          onChange={twoFunctions}
                          defaultValue={upgrade.currSkill3}
                        />
                      </label>
                    </p>
                    <p>
                      <label htmlFor='goalSkill3'>
                        Goal LVL:{' '}
                        <input
                          type='number'
                          name='goalSkill3'
                          id='goalSkill3'
                          min='1'
                          max='10'
                          onChange={twoFunctions}
                          defaultValue={upgrade.goalSkill3}
                        />
                      </label>
                    </p>

                    <p>Passive 2</p>
                    <p>
                      <label htmlFor='currSkill4'>
                        Current LVL:{' '}
                        <input
                          type='number'
                          name='currSkill4'
                          id='currSkill4'
                          min='1'
                          max='10'
                          onChange={twoFunctions}
                          defaultValue={upgrade.currSkill4}
                        />
                      </label>
                    </p>
                    <p>
                      <label htmlFor='goalSkill4'>
                        Goal LVL:{' '}
                        <input
                          type='number'
                          name='goalSkill4'
                          id='goalSkill4'
                          min='1'
                          max='10'
                          onChange={twoFunctions}
                          defaultValue={upgrade.goalSkill4}
                        />
                      </label>
                    </p>
                  </div>
                </div>
                {/* <input type="button" value="Change character" onClick={changeChar} /> */}
              </fieldset>
              <fieldset>
                <legend>Crimebrands</legend>
                <p>
                  <label htmlFor='currECB'>Current ECB LVL: </label>
                  <select
                    id='currECB'
                    name='currECB'
                    onChange={twoFunctions}
                    defaultValue={upgrade.currECB}
                  >
                    <option value='0'>Locked</option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                  </select>
                </p>
                <p>
                  <label htmlFor='goalECB'>Goal ECB LVL: </label>
                  <select
                    id='goalECB'
                    name='goalECB'
                    onChange={twoFunctions}
                    defaultValue={upgrade.goalECB}
                  >
                    <option value='0'>Still Locked</option>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                  </select>
                </p>
              </fieldset>
            </div>
            <button
              onClick={() => {
                changeChar()
                close()
              }}
            >
              Change character
            </button>
            <button onClick={() => close()}>Close</button>
          </div>
        )}
      </Popup>
      {/* <div>
                <p>{upgrade.currPhase} -{">"} {upgrade.goalPhase}</p>
                <p>N: {upgrade.currSkill1} -{">"} {upgrade.goalSkill1}</p>
                <p>U: {upgrade.currSkill2} -{">"} {upgrade.goalSkill2}</p>
                <p>P1: {upgrade.currSkill3} -{">"} {upgrade.goalSkill3}</p>
                <p>P2: {upgrade.currSkill4} -{">"} {upgrade.goalSkill4}</p>
            </div> */}
    </div>
  )
}

export default CharUpgrade
