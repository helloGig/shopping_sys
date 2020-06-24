import Vue from 'vue'
import {
    Message,
    Button,
    Form,
    FormItem,
    Input,
    Avatar,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Step,
    Steps,
    Checkbox,
    CheckboxGroup,
    Upload
} from 'element-ui' //弹框提示,需要全局挂载
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Steps)
Vue.use(Step)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Alert)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Tag)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Avatar)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
    // 为了实现Class的私有属性
const showMessage = Symbol('showMessage')
    /** 
     *  重写ElementUI的Message
     *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
     */
let messageInstance = null;
class newMessage {
    success(options, single = true) {
        this[showMessage]('success', options, single)
    }
    warning(options, single = true) {
        this[showMessage]('warning', options, single)
    }
    info(options, single = true) {
        this[showMessage]('info', options, single)
    }
    error(options, single = true) {
            this[showMessage]('error', options, single)
        }
        [showMessage](type, options, single) {
            if (messageInstance && single) {
                messageInstance.close() //先把原来的关闭
            }
            messageInstance = Message[type](options) //再创建新的消息
        }
}
Vue.prototype.$message = new newMessage()
Vue.prototype.$confirm = MessageBox.confirm