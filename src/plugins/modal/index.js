import container, * as con from './container'
import wrapper from './wrapper'
// import container from './container'

export default {
  install: (Vue, modals) => {
    con.setModals(modals)
    Vue.component('modal', wrapper)
    Vue.component('modal-container', container)
    Vue.prototype.$modal = function (name, opt = {}) {
      con.getVM().list = [
        ...con.getVM().list,
        {
          id: name,
          ...opt,
        }
      ]
    }
    Vue.prototype.$modalClose = function (name) {
      if (!name) {
        con.getVM().list.pop()
      } else {
        con.getVM().list = con.getVM().list.filter(m => m.id !== name)
      }
    }

    Vue.prototype.$message = function (opt) {
      return this.$modal('message', opt)
    }
    Vue.prototype.$confirm = function (opt = {}) {
      // return this.$vs.dialog({
      //   type: 'confirm',
      //   acceptText: '确定',
      //   cancelText: '取消',
      //   ...opt,
      // })
      return new Promise((resolve, reject) => {
        this.$message({
          type: 'confirm',
          acceptText: '确定',
          cancelText: '取消',
          accept() {
            resolve()
            opt.onOk && opt.onOk()
          },
          cancel() {
            reject()
            opt.onCancel && opt.onCancel()
          },
          ...opt,
        })
      })
    }
  }
}