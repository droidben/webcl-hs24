import {EDITABLE, LABEL, VALID, VALUE} from "../kolibri/presentationModel.js";

export { personListItemProjector, personFormProjector }

const bindTextInput = (textAttr, inputElement) => {
    inputElement.oninput = _ => textAttr.setConvertedValue(inputElement.value);

    textAttr.getObs(VALUE).onChange(text => inputElement.value = text);

    textAttr.getObs(VALID, true).onChange(
        valid => valid
          ? inputElement.classList.remove("invalid")
          : inputElement.classList.add("invalid")
    );

    textAttr.getObs(EDITABLE, true).onChange(
        isEditable => isEditable
        ? inputElement.removeAttribute("readonly")
        : inputElement.setAttribute("readonly", true));

    // todo: the label property should be shown as a pop-over on the text element.
    textAttr.getObs(LABEL).onChange(
      label => inputElement.setAttribute("title", label)
    );

};

const personTextProjector = textAttr => {

    const inputElement = document.createElement("INPUT");
    inputElement.type = "text";
    inputElement.size = 20;

    bindTextInput(textAttr, inputElement);

    return inputElement;
};

const personListItemProjector = (masterController, selectionController, rootElement, person) => {

    const deleteButton      = document.createElement("Button");
    deleteButton.setAttribute("class","delete");
    deleteButton.innerHTML  = "&times;";
    deleteButton.onclick    = _ => masterController.removePerson(person);

    const firstnameInputElement = document.createElement("Input"); // todo create the input fields and bind to the attribute props
    firstnameInputElement.setAttribute("type","text");
    bindTextInput(person.firstname, firstnameInputElement); // todo create the input fields and bind to the attribute props

    const lastnameInputElement = document.createElement("Input"); // todo create the input fields and bind to the attribute props
    lastnameInputElement.setAttribute("type","text");
    bindTextInput(person.lastname, lastnameInputElement); // todo create the input fields and bind to the attribute props

    // todo: when a line in the master view is clicked, we have to set the selection
    firstnameInputElement.onclick = _ => selectionController.setSelectedPerson(person);
    lastnameInputElement .onclick = _ => selectionController.setSelectedPerson(person);

    selectionController.onPersonSelected(
        selected => selected === person
          ? deleteButton.classList.add("selected")
          : deleteButton.classList.remove("selected")
    );

    masterController.onPersonRemove( (removedPerson, removeMe) => {
        if (removedPerson !== person) return;
        rootElement.removeChild(deleteButton);
        rootElement.removeChild(firstnameInputElement);
        rootElement.removeChild(lastnameInputElement);
        // todo: what to do with selection when person was removed?
        selectionController.clearSelection();
        removeMe();
    } );

    rootElement.appendChild(deleteButton);
    rootElement.appendChild(firstnameInputElement);
    rootElement.appendChild(lastnameInputElement);
    // todo: what to do with selection when person was added?
    selectionController.setSelectedPerson(person);
};

const personFormProjector = (detailController, rootElement, person) => {

    const divElement = document.createElement("DIV");
    divElement.innerHTML = `
    <FORM>
        <DIV class="detail-form">
            <LABEL for="firstname"></LABEL>
            <INPUT TYPE="text" size="20" id="firstname">   
            <LABEL for="lastname"></LABEL>
            <INPUT TYPE="text" size="20" id="lastname">   
        </DIV>
    </FORM>`;

    // todo: bind text values
    bindTextInput(person.firstname, divElement.querySelector("#firstname"));
    bindTextInput(person.lastname,  divElement.querySelector("#lastname"));

    // todo: bind label values
    person.firstname.getObs(LABEL).onChange(
        label => divElement.querySelector("label[for=firstname]").textContent = label
    );
    person.lastname.getObs(LABEL).onChange(
        label => divElement.querySelector("label[for=lastname]").textContent = label
    );


    rootElement.firstChild.replaceWith(divElement); // react - style ;-)
};
