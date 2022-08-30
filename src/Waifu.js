import React, { PureComponent } from "react";

import Aqua   from './waifus/aqua.png';
import Esdese from './waifus/Esdese.png';
import Asuka  from './waifus/Asuka.png';
import Faye   from './waifus/faye_valentine.png';
import Kurisu from './waifus/Kurisu_Makise.png';
import Motoko from './waifus/kusanagi_motoko.png';
import Yoko   from './waifus/Yoko_Littner.png';
import Yuukki from './waifus/Yuuki_Asuna.png';

import './Waifu.css';

const waifuArray = [Aqua,Esdese,Asuka,Faye,Kurisu,Motoko,Yoko,Yuukki];

export default class Waifu extends PureComponent {
  render(){
    const randomWaifu = waifuArray[Math.floor(Math.random()*waifuArray.length)];
    return (
      <div id="waifu">
        <img src={randomWaifu} alt="waifu"></img>
      </div>
    );
  }
}

