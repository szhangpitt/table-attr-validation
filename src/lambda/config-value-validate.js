module.exports =
function configValueValidateLambda (attrConfig) {
    return function validateAttrVal (attrVal) {
        if (!attrConfig.required) {
            return true;
        }

        if (attrConfig.values) {
            return attrConfig.values.indexOf(attrVal) !== -1
        }

        return !!attrVal;
    }
}