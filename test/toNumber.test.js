import { BigAmount } from "../dist/index.js";
import { runTestOnPairs } from "./util/cases.js";

describe("#toNumber()", () => {
  it("converts a BigAmount into a number (num, den within SAFE_INTEGER)", () => {
    runTestOnPairs((xn, xd) => {
      if (
        (xn < 0n ? -xn : xn) <= Number.MAX_SAFE_INTEGER &&
        (xd < 0n ? -xd : xd) <= Number.MAX_SAFE_INTEGER
      ) {
        assert.closeTo(
          new BigAmount(xn, xd).toNumber(),
          Number(xn) / Number(xd),
          Number.EPSILON,
        );
      }
    });
  });

  it("converts a BigAmount into a number (num, den out of SAFE_INTEGER)", () => {
    const cases = [
      // {{{
      [
        164604613078689775951032133698023598n,
        51083313437995649385848470553320880n,
        3.2222775305772795,
      ],
      [
        757860780137486757350565291515188289n,
        954722644220647967819685496061556135n,
        0.7938020374033739,
      ],
      [
        -810830494582269068325778676004584267n,
        742609288312400401860936349432502830n,
        -1.0918668906295304,
      ],
      [
        -829493178972670941982011332181761635n,
        103354063288056868037090138180548653n,
        -8.025743280753273,
      ],
      [
        602800587283880159727566679915865155n,
        -487337476838528663608925615619405583n,
        -1.236926392762542,
      ],
      [
        -655452049173944597393307309093060228n,
        961055095180112651500034192851847569n,
        -0.6820129797564888,
      ],
      [
        -300997606035133491145706398748960067n,
        -294055690994065024175497035325313256n,
        1.0236074840707932,
      ],
      [
        -603416363450032179675118404111560005n,
        40649496924240046430794138314568688n,
        -14.844374693606696,
      ],
      [
        -465684048286189049452356312115116601n,
        -507727273758446293702651562813722156n,
        0.9171932893007053,
      ],
      [
        -399312514658824128112068988013711400n,
        467352807513469363352156076704077826n,
        -0.8544134286543592,
      ],
      [
        -69399597339229626133014105654842224n,
        265164169732030857446545289525528962n,
        -0.26172313329271957,
      ],
      [
        -244713292563676242585476515565279376n,
        -376534866676212471518738922826302841n,
        0.6499087182120337,
      ],
      [
        -573366925975265106588524136650636142n,
        -706462500361973452075147356652002911n,
        0.8116027753511141,
      ],
      [
        608740995995108425977631292426988311n,
        -891556478779003569652954715296931783n,
        -0.6827845576634538,
      ],
      [
        -646150704174465482448165950488075292n,
        599856491881579395192469042471134912n,
        -1.0771754793345227,
      ],
      [
        868465712368249660043099717130465396n,
        583022055848446457128152690320011352n,
        1.4895932386372752,
      ],
      [422271415545068143996912525264632168n, -87n, -4.853694431552507e33],
      [818790964597299608789684521708920561n, 36n, 2.27441934610361e34],
      [-721240882791504992696183792067233928n, 26n, -2.7740033953519423e34],
      [-162045113053153522800685658526884697n, 62n, -2.6136308556960243e33],
      [607412618983566323296577040994233176n, 32n, 1.8981644343236448e34],
      [57507534826445480550686936319273808n, -9n, -6.389726091827275e33],
      [-910235184189403836275670001610387872n, -50n, 1.8204703683788076e34],
      [448674273152714159190541635372811048n, 50n, 8.973485463054283e33],
      [-39367767816277239177012458505866975n, -63n, 6.2488520343297205e32],
      [225851032122966333351092802895954554n, 71n, 3.1810004524361453e33],
      [-33467805593512171862166593813409401n, -47n, 7.12080970074727e32],
      [65463554184923561065058910239005477n, 42n, 1.5586560520219897e33],
      [447603710578881761025252429280832539n, 18n, 2.4866872809937876e34],
      [400640891778931461824932626729138720n, 59n, 6.790523589473414e33],
      [-344545612702156939690192464233845719n, -46n, 7.490122015264282e33],
      [-717880633612780468977282322811020918n, 68n, -1.055706814136442e34],
      [-13n, 396742627247064681715585881497953219n, -3.2766834484625403e-35],
      [40n, 341898741495505692805320708399517424n, 1.1699370353056946e-34],
      [-40n, -301518524619243547168373041151084423n, 1.3266183247119509e-34],
      [97n, 312426866593377157408102980228235184n, 3.1047265895428027e-34],
      [9n, 382103573884285551864259611462802880n, 2.355382313886841e-35],
      [-48n, -147963704667433951172907069219003360n, 3.2440388072119253e-34],
      [41n, -223040383738014504774036614867846710n, -1.8382321314582662e-34],
      [5n, 988807728467463717906742420359871613n, 5.0565947818282276e-36],
      [17n, 484866098461385750264366009760459753n, 3.506122629308525e-35],
      [-70n, 74494099577996434643943516822853888n, -9.396717377154006e-34],
      [-46n, 653374811438809774859621995441167984n, -7.040369355332581e-35],
      [75n, -727901666517141938012945628358242918n, -1.0303589543744198e-34],
      [-61n, 226867074807803221633685376678125720n, -2.6887991592291587e-34],
      [69n, -352178406066093164383248253152583722n, -1.959234263416219e-34],
      [-66n, -837023981311802456059468354848914930n, 7.885078740105313e-35],
      [16n, -645728186615128760620717079019215912n, -2.4778227637655265e-35],
      // }}}
    ];

    for (const [xn, xd, r] of cases) {
      assert.closeTo(new BigAmount(xn, xd).toNumber(), r, Number.EPSILON);
    }
  });
});

// vim: fdm=marker fmr&