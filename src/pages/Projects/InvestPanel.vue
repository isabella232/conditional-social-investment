<md-drawer class="md-right" :md-active.sync="showSidepanel">
    <div>
        <form novalidate class="md-layout">
            <md-card class="md-layout-item ">
                <md-card-header style="background-color: rgb(80, 174, 84);">
                    <h3 class="md-title" style="color: #fff;">Create a condition</h3>
                </md-card-header>

                <md-card-content>
                    <div class="md-layout-item md-small-size-100">
                        <md-field>
                            <label for="question">Question</label>
                            <md-input name="question" id="question" v-model="form.question" :disabled="sending"/>
                        </md-field>
                    </div>
                    <div class="md-layout-item md-small-size-100">
                        <md-field>
                            <label for="oracle">Oracle Address</label>
                            <md-input name="oracle" id="oracle" v-model="form.oracle" :disabled="sending"/>
                        </md-field>
                    </div>
                </md-card-content>
                <md-progress-bar md-mode="indeterminate" v-if="sending"/>
                <md-card-actions>
                    <md-button type="submit"
                               class="md-primary"
                               :disabled="sending"
                               @click="addCondition">Create condition</md-button>
                </md-card-actions>
            </md-card>

            <md-snackbar :md-active.sync="conditionAdded">Your condition has been deployed with success!</md-snackbar>
        </form>
    </div>
</md-drawer>
