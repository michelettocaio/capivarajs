import {MapDom} from '../map-dom';
import {Common} from '../../common';

export class CPIf {

    private element: any;
    private map: MapDom;
    private attribute;
    private elementComment;

    constructor(_element: HTMLElement, _map: MapDom) {
        Common.getScope(_element).$on('$onInit', () => {
            this.element = _element;
            this.map = _map;
            this.attribute = Common.getAttributeCpIf(this.element);
            this.elementComment = document.createComment('cpIf ' + this.attribute);
            this.init();
        });
    }

    public static isValidCondition(element){
        let scope = Common.getScope(element).$parent || Common.getScope(element);
        return Common.evalInContext(Common.getAttributeCpIf(element), scope.scope);
    }

    init() {
        if(!this.element) { return; }
        try {
            CPIf.isValidCondition(this.element) ? this.show() : this.hide();
        } catch (ex) {
            this.hide();
        }
    }

    hide() {
        this.element.replaceWith(this.elementComment);
        if(this.element.$instance) this.element.$instance.destroy();
    }

    show() {
        this.elementComment.replaceWith(this.element);
        if(this.element.$instance) this.element.$instance.initController();
    }

}