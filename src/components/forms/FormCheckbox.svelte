<script>
    export let name;
    export let text;
</script>

<div class="form-control">
    <label class="cursor-pointer label">
        <span class="label-text mr-2" for={name}>{text}</span>
        <input type="checkbox" checked="checked" class="checkbox checkbox-primary checkbox-sm" />
    </label>
</div>
