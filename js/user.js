/**
 * 对某一个表单进行验证的构造函数
 */
//  FieldValidator是一个类，类就是构造函数
class FieldValidator {
    /**
     * @param {String} txtId 文本框的Id
     * @param {Function} validatorFunc 验证规则函数，当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回，则表示无错误
     * function中会传入该文本的值
     */

    //  1、constructor 称为构造函数，因为它指回构造函数本身。
    //  2、constructor主要用于记录该对象引用于哪个构造函数，可以使原型对象重新指向原始构造函数。
    //  在许多情况下，我们需要手动使用constructor这一属性来恢复原来的构造函数。
    // constructor是构造器，这个函数不用调用，在new的时候就执行了
    constructor(txtId, validatorFunc) {
        this.input = $('#' + txtId);
        this.p = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        // 失去焦点时的验证
        this.input.onblur = () => {
            this.validator();
        };
    }

    /**
     * 验证，成功返回true，失败返回false
     * 此方法为自定义方法,并且是在原型上，是一个原型方法
     */
    async validator() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            this.p.innerHTML = err;
            return false;
        } else {
            this.p.innerHTML = '';
            return true;
        }
    }

    // 静态方法
    /**
     * 对传入的所有验证器进行统一的验证，如果所有的验证都通过，则返回true,否则返回false
     * @param {FieldValidator[]} validators 
     */
    static async validatorX(...validators) {
        const proms = validators.map((v) => v.validator());
        // results返回的是一个数组
        const results = await Promise.all(proms);
        return results.every((r) => r);
    }
}






// function test() {
//     FieldValidator.validator(loginId, nickname).then((result) => {
//         console.log(result);
//     });
// }
