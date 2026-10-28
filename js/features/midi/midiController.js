/**
 * Fichier : js/features/midi/midiController.js
 * Rôle : coordonner le service Midi.
 *
 * Ce contrôleur ne contient ni validation métier,
 * ni gestion de liste MyPos, ni accès direct à Supabase.
 *
 * Le récapitulatif visuel a été supprimé au profit d’une
 * saisie directe en 2 colonnes, sans défilement.
 */


import midiView from './midiView.js';
import { createPaymentList } from '../../utils/paymentList.js';
import { setupEnterNavigation } from '../../utils/formNavigation.js';
import {
  validateMidiRawData,
  buildMidiClosingData,
} from '../../validation/midiValidation.js';
import {
  saveDailyClosing,
  closeDailyClosing,
} from '../../services/dailyClosingService.js';


const midiController = {
  init() {
    midiView.init();


    this.myPos = createPaymentList({
      amountInput: midiView.elements.myPosAmount,
      addButton: midiView.elements.myPosAddButton,
      listElement: midiView.elements.myPosList,
      totalElement: midiView.elements.myPosTotal,
      onChange: () => this.updateRecap(),
    });


    setupEnterNavigation(
      midiView.elements.form,
      midiView.elements.myPosAmount,
    );


    midiView.elements.form.addEventListener('input', () => {
      this.updateRecap();
    });


    midiView.elements.form.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleValidate();
    });


    midiView.setLocked(false);
    this.updateRecap();
  },


  getBusinessDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');


    return `${year}-${month}-${day}`;
  },


  getRawMidiData() {
    return {
      myPosTotal: this.myPos.getTotal(),
      cbClassic: midiView.getRawValue(midiView.elements.cbClassic),
      cbTicketResto: midiView.getRawValue(midiView.elements.cbTicketResto),
      cashAdipos: midiView.getRawValue(midiView.elements.cashAdipos),
      ancvPaper: midiView.getRawValue(midiView.elements.ancvPaper),
      ancvConnect: midiView.getRawValue(midiView.elements.ancvConnect),
      checks: midiView.getRawValue(midiView.elements.checks),
      vat55: midiView.getRawValue(midiView.elements.vat55),
      vat10: midiView.getRawValue(midiView.elements.vat10),
      vat20: midiView.getRawValue(midiView.elements.vat20),
      pizzasDineIn: midiView.getRawValue(midiView.elements.pizzasDineIn),
      pizzasTakeaway: midiView.getRawValue(midiView.elements.pizzasTakeaway),
    };
  },


  updateRecap() {
    midiView.clearMessage();
  },


  async handleValidate() {
    midiView.clearMessage();


    const validation = validateMidiRawData(this.getRawMidiData());


    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      midiView.showMessage(firstError, 'error');
      return;
    }


    const closingData = buildMidiClosingData(validation.data);


    try {
      midiView.showMessage('Enregistrement du Midi en cours…', 'info');


      await saveDailyClosing(this.getBusinessDate(), 'midi', closingData);
      await closeDailyClosing(this.getBusinessDate(), 'midi');


      // La clôture est enregistrée : la saisie repart de zéro
      // pour la prochaine utilisation, formulaire verrouillé.
      this.myPos.clear();
      midiView.reset();
      midiView.setLocked(true);


      midiView.showMessage(
        'Midi enregistré et validé dans Supabase.',
        'success',
      );
    } catch (error) {
      midiView.setLocked(false);
      midiView.showMessage(error.message, 'error');
    }
  },
};


export default midiController;